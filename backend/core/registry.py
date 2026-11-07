from dataclasses import dataclass
import json
import logging
from pathlib import Path
import re
from typing import Dict, List, Optional, Tuple
import unicodedata

logger = logging.getLogger(__name__)

DEFAULT_KNOWLEDGE_DIR = Path(__file__).resolve().parent.parent / "knowledge"
KNOWLEDGE_FILES = ("speaker-talk.md", "partner-sponsor.md", "programma-logistica.md", "visione-concept.md")

ENTITY_BLOCK_RE = re.compile(r"(#+ .*?)\n> \*\*METADATA\*\*: (\{.*?\})")
_MARKDOWN_REF_RE = re.compile(r"\[\[REF:(.*?)\]\].*?\((https?://.*?)\)")
_RAW_REF_RE = re.compile(r"\[\[REF:(.*?)\]\].*?(https?://[^\s\)\],<>]+)")
_META_LINK_RE = re.compile(r'"id":\s*"(.*?)".*?"(?:web|links)":\s*(?:"(.*?)"|\[(.*?)\])')
_FIRST_QUOTED_URL_RE = re.compile(r'"(https?://.*?)"')
_PAREN_RE = re.compile(r"\((.*?)\)")
_PERSON_SPLIT_RE = re.compile(r"\s*(?:&|,|\be\b)\s*", re.IGNORECASE)
_GENERIC_SUFFIXES = (" studio", " design", " magazine", " records", " fotoproduzioni")


@dataclass(frozen=True)
class EntityMeta:
    id: str
    kind: str
    aliases: Tuple[str, ...]
    img: Optional[str]
    web: Optional[str]


def strip_accents(text: str) -> str:
    return "".join(ch for ch in unicodedata.normalize("NFKD", text) if not unicodedata.combining(ch))


def _clean_alias(raw: str) -> str:
    return re.sub(r"\s+", " ", strip_accents(raw).lower()).strip(" .,-")


def _build_aliases(header: str, name: str, eid: str = "") -> Tuple[str, ...]:
    aliases: Dict[str, None] = {}

    def add(candidate: str) -> None:
        cleaned = _clean_alias(candidate)
        if len(cleaned) >= 3:
            aliases[cleaned] = None

    title = _PAREN_RE.sub("", re.sub(r"^#+\s*", "", header)).strip()
    for root in [name] + ([title] if title and not re.match(r"^\d+\.", title) else []):
        add(root)
        norm = _clean_alias(root)
        for suffix in _GENERIC_SUFFIXES:
            if norm.endswith(suffix):
                add(norm[: -len(suffix)])
    if "-" not in eid:
        add(eid)
    for group in _PAREN_RE.findall(header):
        if ":" not in group:
            for part in _PERSON_SPLIT_RE.split(group):
                cleaned_part = _clean_alias(part)
                if len(cleaned_part.split()) >= 2:
                    add(cleaned_part)
                    no_dots = re.sub(r"\b[a-z]\.\s*", "", cleaned_part).strip()
                    if len(no_dots.split()) >= 2:
                        add(no_dots)
    return tuple(aliases)


def extract_links(content: str, links: Dict[str, str]) -> Dict[str, str]:
    for rid, url in _MARKDOWN_REF_RE.findall(content):
        links[rid.lower().strip()] = url.strip()
    for rid, url in _RAW_REF_RE.findall(content):
        links.setdefault(rid.lower().strip(), url.strip())
    for rid, web, links_list in _META_LINK_RE.findall(content):
        first_link = _FIRST_QUOTED_URL_RE.search(links_list) if links_list else None
        target = web.strip() if web else (first_link.group(1) if first_link else None)
        if target:
            links[rid.lower().strip()] = target
    return links


def _read_knowledge_docs(knowledge_dir: Path) -> List[Tuple[str, str]]:
    docs: List[Tuple[str, str]] = []
    for name in KNOWLEDGE_FILES:
        path = knowledge_dir / name
        if path.exists():
            docs.append((name, path.read_text(encoding="utf-8")))
    return docs


def load_static_links(knowledge_dir: Path = DEFAULT_KNOWLEDGE_DIR) -> Dict[str, str]:
    links: Dict[str, str] = {}
    try:
        for _, content in _read_knowledge_docs(knowledge_dir):
            extract_links(content, links)
    except Exception as exc:
        logger.error("Static Link Synchronization Error: %s", exc)
    return links


def load_entity_catalog(knowledge_dir: Path = DEFAULT_KNOWLEDGE_DIR) -> Dict[str, EntityMeta]:
    docs = _read_knowledge_docs(knowledge_dir)
    static_links: Dict[str, str] = {}
    for _, content in docs:
        extract_links(content, static_links)

    catalog: Dict[str, EntityMeta] = {}
    for _, content in docs:
        for header, meta_raw in ENTITY_BLOCK_RE.findall(content):
            meta = json.loads(meta_raw)
            if meta.get("type") in ("speaker", "sponsor"):
                eid = str(meta["id"]).lower().strip()
                catalog[eid] = EntityMeta(
                    id=eid,
                    kind=meta["type"],
                    aliases=_build_aliases(header, str(meta.get("name") or eid), eid),
                    img=meta.get("img"),
                    web=meta.get("web") or static_links.get(eid),
                )
    return catalog


def extract_ref_links(content: str) -> Dict[str, str]:
    return {rid.lower().strip(): url.strip() for rid, url in _RAW_REF_RE.findall(content)}
