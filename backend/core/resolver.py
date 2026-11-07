from dataclasses import dataclass
import re
from typing import Any, Dict, Iterable, List, Optional, Tuple

from core.edition import Edition
from core.intents import detect_intents, mentions_specific_member, requested_day
from core.registry import extract_ref_links

REF_TAG_RE = re.compile(r"\[\[REF:(.*?)\]\]")
_CLEAN_SUFFIXES = ("-studio", "-design", "-creative", "-vision")


@dataclass(frozen=True)
class QueryPlan:
    intents: Dict[str, bool]
    top_k: int
    enhanced_message: str
    specific_member: bool
    day: Optional[str]
    day_date: Optional[str]


def plan_query(message: str, edition: Edition) -> QueryPlan:
    intents = detect_intents(message, edition)
    specific_member = mentions_specific_member(message, edition)
    day = requested_day(message, intents, edition)

    top_k = 20
    hints: List[str] = []
    if intents["program"] or intents["total"] or intents["speaker"] or intents["afternoon"]:
        top_k = 40
        hints.append("(MANDATORIO: Usa [[REF:registry-speakers]] e tagga ogni speaker citato con [[REF:id]].)")
    if intents["sponsor"]:
        hints.append("(MANDATORIO: Usa [[REF:global-partners]])")
    if intents["lodging"]:
        hints.append("(MANDATORIO: Usa [[REF:ospitalita-convenzionata]])")
    if intents["team"]:
        if specific_member:
            hints.append("(MANDATORIO: Usa il tag [[REF:nome-cognome-vision]] specifico richiesto.)")
        else:
            hints.append(f"(MANDATORIO: Usa [[REF:{edition.team.collective_id}]])")

    enhanced = message + ("\n" + "\n".join(hints) if hints else "")
    return QueryPlan(
        intents=intents,
        top_k=top_k,
        enhanced_message=enhanced,
        specific_member=specific_member,
        day=day.key if day else None,
        day_date=day.date if day else None,
    )


def read_source_nodes(
    source_nodes: Iterable[Any], edition: Edition
) -> Tuple[Dict[str, Dict[str, Any]], Dict[str, str]]:
    node_map: Dict[str, Dict[str, Any]] = {}
    registry_links: Dict[str, str] = {}
    for item in source_nodes or []:
        node = getattr(item, "node", None)
        if node is None:
            continue
        meta = getattr(node, "metadata", None) or {}
        tid = str(meta.get("id") or "").lower().strip()
        if tid:
            node_map[tid] = meta
        if any(marker in tid for marker in edition.registry_id_markers):
            registry_links.update(extract_ref_links(node.get_content() or ""))
    return node_map, registry_links


def collect_active_ids(
    message: str,
    response_text: str,
    plan: QueryPlan,
    node_map: Dict[str, Dict[str, Any]],
    static_links: Dict[str, str],
    edition: Edition,
) -> List[str]:
    active: Dict[str, None] = {}
    lower_msg = message.lower()
    lower_resp = response_text.lower()

    for tag in REF_TAG_RE.findall(response_text):
        active[tag.lower().strip()] = None

    for slug in static_links:
        clean_name = slug
        for suffix in _CLEAN_SUFFIXES:
            clean_name = clean_name.replace(suffix, "")
        clean_name = clean_name.replace("-", " ")

        if slug.endswith("-vision") and plan.specific_member:
            if clean_name in lower_msg:
                active[slug] = None
            continue
        if re.search(rf"\b{re.escape(clean_name)}\b", lower_resp):
            active[slug] = None

    if plan.day_date:
        intents = plan.intents
        for tid, meta in node_map.items():
            if not isinstance(meta, dict) or meta.get("date") != plan.day_date:
                continue
            node_time = meta.get("time", "00:00")
            is_morning = edition.morning_start <= node_time <= edition.morning_end
            is_afternoon = node_time > edition.morning_end
            if (
                (intents["morning"] and is_morning)
                or (intents["afternoon"] and is_afternoon)
                or (not intents["morning"] and not intents["afternoon"])
            ):
                active[tid] = None

    return list(active)


def resolve_links(
    response_text: str,
    plan: QueryPlan,
    active_ids: Iterable[str],
    node_map: Dict[str, Dict[str, Any]],
    registry_links: Dict[str, str],
    static_links: Dict[str, str],
    edition: Edition,
) -> List[str]:
    links: List[str] = []
    intents = plan.intents
    if intents["ticket"] or "ticket" in response_text.lower():
        links.append(edition.ticket_url)
    if intents["social"]:
        links.extend(edition.social_links)
    if intents["lodging"]:
        links.extend(edition.lodging_links)

    for aid in active_ids:
        if plan.specific_member and aid in edition.team.collective_ids:
            if not any(name in aid for name in edition.team.first_names):
                continue
        url = registry_links.get(aid) or static_links.get(aid) or (node_map.get(aid) or {}).get("web")
        if url and url not in links:
            links.append(url)
    return list(dict.fromkeys(links))


def resolve_images(
    plan: QueryPlan,
    active_ids: List[str],
    node_map: Dict[str, Dict[str, Any]],
    edition: Edition,
) -> List[str]:
    intents = plan.intents
    composite: List[str] = []
    if intents["sponsor"]:
        composite.append("sponsor-wall")
    elif (intents["total"] or intents["program"] or plan.day_date) and not (intents["workshop"] or intents["ticket"]):
        days = [plan.day] if plan.day else [d.key for d in edition.days]
        for day in days:
            if plan.day and intents["morning"]:
                composite.append(f"gallery-{day}-morning")
            elif plan.day and intents["afternoon"]:
                composite.append(f"gallery-{day}-afternoon")
            else:
                composite.extend([f"gallery-{day}-morning", f"gallery-{day}-afternoon"])

    images: List[str] = []
    if composite:
        for cid in composite:
            img = edition.assets.get(cid)
            if img and img not in images:
                images.append(img)
        return images

    limit = 5 if (intents["workshop"] or intents["ticket"] or len(active_ids) <= 2) else 10
    for aid in active_ids:
        meta = node_map.get(aid) or {}
        img = edition.assets.get(aid) or meta.get("img")
        if img and img not in images:
            images.append(img)
    return images[:limit]


def strip_ref_tags(text: str) -> str:
    return REF_TAG_RE.sub("", text).strip()
