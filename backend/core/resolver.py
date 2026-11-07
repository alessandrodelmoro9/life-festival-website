from dataclasses import dataclass
import re
from typing import Any, Dict, Iterable, List, Mapping, Optional, Tuple

from core.edition import Edition
from core.intents import detect_intents, mentions_specific_member, requested_day
from core.registry import EntityMeta, extract_ref_links, strip_accents

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
    named: Tuple[EntityMeta, ...] = ()


def find_named_entities(
    message: str, intents: Dict[str, bool], catalog: Mapping[str, EntityMeta], ambiguous: Iterable[str] = ()
) -> Tuple[EntityMeta, ...]:
    if not catalog or intents.get("workshop"):
        return ()
    plain_msg = strip_accents(message)
    skip = "zetafonts" if intents.get("sponsor") else "zetafonts-partner"
    candidates: List[Tuple[int, int, str]] = []
    for eid, meta in catalog.items():
        if eid == skip:
            continue
        for alias in meta.aliases:
            for m in re.finditer(rf"(?<!\w){re.escape(alias)}(?!\w)", plain_msg, re.IGNORECASE):
                if alias not in ambiguous or m.group(0)[0].isupper():
                    candidates.append((m.start(), m.end(), eid))

    accepted: List[Tuple[int, int, str]] = []
    for start, end, eid in sorted(candidates, key=lambda x: (-(x[1] - x[0]), x[0])):
        if all(end <= a_start or start >= a_end for a_start, a_end, _ in accepted):
            accepted.append((start, end, eid))

    return tuple({eid: catalog[eid] for _, _, eid in sorted(accepted)}.values())


def plan_query(
    message: str, edition: Edition, catalog: Optional[Mapping[str, EntityMeta]] = None
) -> QueryPlan:
    intents = detect_intents(message, edition)
    specific_member = mentions_specific_member(message, edition)
    day = requested_day(message, intents, edition)
    named = find_named_entities(message, intents, catalog or {}, edition.ambiguous_aliases)

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
        tag = "nome-cognome-vision]] specifico richiesto." if specific_member else f"{edition.team.collective_id}]]"
        prefix = "Usa il tag [[REF:" if specific_member else "Usa [[REF:"
        hints.append(f"(MANDATORIO: {prefix}{tag})")

    enhanced = message + ("\n" + "\n".join(hints) if hints else "")
    return QueryPlan(
        intents=intents,
        top_k=top_k,
        enhanced_message=enhanced,
        specific_member=specific_member,
        day=day.key if day else None,
        day_date=day.date if day else None,
        named=named,
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
    if plan.named:
        return [e.id for e in plan.named]

    active: Dict[str, None] = {t.lower().strip(): None for t in REF_TAG_RE.findall(response_text)}
    lower_msg = message.lower()

    for slug in static_links:
        clean_name = slug
        for suffix in _CLEAN_SUFFIXES:
            clean_name = clean_name.replace(suffix, "")
        clean_name = clean_name.replace("-", " ")

        if slug.endswith("-vision") and plan.specific_member:
            if clean_name in lower_msg:
                active[slug] = None
            continue
        if any(m.group(0)[0].isupper() for m in re.finditer(rf"\b{re.escape(clean_name)}\b", response_text, re.IGNORECASE)):
            active[slug] = None

    if plan.day_date:
        intents = plan.intents
        for tid, meta in node_map.items():
            if not isinstance(meta, dict) or meta.get("date") != plan.day_date:
                continue
            node_time = meta.get("time", "00:00")
            is_morning = edition.morning_start <= node_time <= edition.morning_end
            is_afternoon = node_time > edition.morning_end
            if (intents["morning"] and is_morning) or (intents["afternoon"] and is_afternoon) or not (intents["morning"] or intents["afternoon"]):
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

    if intents["ticket"] or (not plan.named and "ticket" in response_text.lower()):
        links.append(edition.ticket_url)
    if intents["social"]:
        links.extend(edition.social_links)
    if intents["lodging"]:
        links.extend(edition.lodging_links)

    if plan.named:
        return list(dict.fromkeys(links + [e.web for e in plan.named if e.web]))

    for aid in active_ids:
        if plan.specific_member and aid in edition.team.collective_ids:
            if not any(name in aid for name in edition.team.first_names):
                continue
        url = registry_links.get(aid) or static_links.get(aid) or (node_map.get(aid) or {}).get("web")
        if url:
            links.append(url)
    return list(dict.fromkeys(links))


def _composite_images(plan: QueryPlan, edition: Edition) -> List[str]:
    intents = plan.intents
    ids: List[str] = []
    if intents["sponsor"]:
        ids.append("sponsor-wall")
    elif (intents["total"] or intents["program"] or plan.day_date) and not (intents["workshop"] or intents["ticket"]):
        days = [plan.day] if plan.day else [d.key for d in edition.days]
        for day in days:
            if plan.day and (intents["morning"] or intents["afternoon"]):
                slot = "morning" if intents["morning"] else "afternoon"
                ids.append(f"gallery-{day}-{slot}")
            else:
                ids.extend([f"gallery-{day}-morning", f"gallery-{day}-afternoon"])
    return [edition.assets[cid] for cid in ids if cid in edition.assets]


def resolve_images(
    plan: QueryPlan,
    active_ids: List[str],
    node_map: Dict[str, Dict[str, Any]],
    edition: Edition,
) -> List[str]:
    intents = plan.intents
    composites = _composite_images(plan, edition)

    if plan.named:
        prefix = composites if intents.get("explicit_list") else []
        return list(dict.fromkeys(prefix + [e.img for e in plan.named if e.img]))

    if composites:
        return list(dict.fromkeys(composites))

    limit = 5 if (intents["workshop"] or intents["ticket"] or len(active_ids) <= 2) else 10
    images = [edition.assets.get(aid) or (node_map.get(aid) or {}).get("img") for aid in active_ids]
    return list(dict.fromkeys(img for img in images if img))[:limit]


def strip_ref_tags(text: str) -> str:
    return re.sub(r" ?\[\[REF:.*?\]\]", "", text).strip()
