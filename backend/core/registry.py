from dataclasses import dataclass
import json
import logging
from pathlib import Path
import re
from typing import Dict, Optional, Tuple
import unicodedata

logger = logging.getLogger(__name__)

DEFAULT_KNOWLEDGE_DIR = Path(__file__).resolve().parent.parent / "knowledge"
KNOWLEDGE_FILES = ("speaker-talk.md", "partner-sponsor.md", "programma-logistica.md", "visione-concept.md")

_MARKDOWN_REF_RE = re.compile(r"\[\[REF:(.*?)\]\].*?\((https?://.*?)\)")
_RAW_REF_RE = re.compile(r"\[\[REF:(.*?)\]\].*?(https?://[^\s\)\],<>]+)")
_META_LINK_RE = re.compile(r'"id":\s*"(.*?)".*?"(?:web|links)":\s*(?:"(.*?)"|\[(.*?)\])')
_FIRST_QUOTED_URL_RE = re.compile(r'"(https?://.*?)"')
_ENTITY_BLOCK_RE = re.compile(r"(#+ .*?)\n> \*\*METADATA\*\*: (\{.*?\})")
_PAREN_RE = re.compile(r"\((.*?)\)")
_PERSON_SPLIT_RE = re.compile(r"\s*(?:&|,|\be\b)\s*", re.IGNORECASE)
_GENERIC_SUFFIXES = (" studio", " design", " magazine", " records", " fotoproduzioni", " visual designer")


@dataclass(frozen=True)
class EntityMeta:
    id: str
    kind: str
    aliases: Tuple[str, ...]
    img: Optional[str]
    web: Optional[str]


def normalize_text(text: str) -> str:
    decomposed = unicodedata.normalize("NFKD", text)
    return "".join(ch for ch in decomposed if not unicodedata.combining(ch)).lower()


def _clean_alias(raw: str) -> str:
    return re.sub(r"\s+", " ", normalize_text(raw)).strip(" .,-")


def _build_aliases(header: str, name: str) -> Tuple[str, ...]:
    aliases: Dict[str, None] = {}

    def add(candidate: str) -> None:
        cleaned = _clean_alias(candidate)
        if len(cleaned) >= 3:
            aliases[cleaned] = None

    add(name)
    norm_name = _clean_alias(name)
    for suffix in _GENERIC_SUFFIXES:
        if norm_name.endswith(suffix):
            add(norm_name[: -len(suffix)])

    header_title = _PAREN_RE.sub("", re.sub(r"^#+\s*", "", header)).strip()
    if header_title and not re.match(r"^\d+\.", header_title):
        add(header_title)
        norm_title = _clean_alias(header_title)
        for suffix in _GENERIC_SUFFIXES:
            if norm_title.endswith(suffix):
                add(norm_title[: -len(suffix)])

    for group in _PAREN_RE.findall(header):
        if ":" in group:
            continue
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
        rid_clean = rid.lower().strip()
        if rid_clean not in links:
            links[rid_clean] = url.strip()
    for rid, web, links_list in _META_LINK_RE.findall(content):
        rid_clean = rid.lower().strip()
        if web:
            links[rid_clean] = web.strip()
        elif links_list:
            first_link = _FIRST_QUOTED_URL_RE.search(links_list)
            if first_link:
                links[rid_clean] = first_link.group(1)
    return links


def load_static_links(knowledge_dir: Path = DEFAULT_KNOWLEDGE_DIR) -> Dict[str, str]:
    links: Dict[str, str] = {}
    try:
        for path in (knowledge_dir / name for name in KNOWLEDGE_FILES):
            if path.exists():
                extract_links(path.read_text(encoding="utf-8"), links)
    except Exception as exc:
        logger.error("Static Link Synchronization Error: %s", exc)
    return links


def load_entity_catalog(knowledge_dir: Path = DEFAULT_KNOWLEDGE_DIR) -> Dict[str, EntityMeta]:
    static_links = load_static_links(knowledge_dir)
    catalog: Dict[str, EntityMeta] = {}
    try:
        for path in (knowledge_dir / name for name in KNOWLEDGE_FILES):
            if not path.exists():
                continue
            content = path.read_text(encoding="utf-8")
            for match in _ENTITY_BLOCK_RE.finditer(content):
                header, meta_raw = match.group(1), match.group(2)
                meta = json.loads(meta_raw)
                kind = meta.get("type")
                if kind not in ("speaker", "sponsor"):
                    continue
                eid = str(meta["id"]).lower().strip()
                name = str(meta.get("name") or eid)
                aliases = _build_aliases(header, name)
                web = meta.get("web") or static_links.get(eid)
                catalog[eid] = EntityMeta(
                    id=eid,
                    kind=kind,
                    aliases=aliases,
                    img=meta.get("img"),
                    web=web,
                )
    except Exception as exc:
        logger.error("Entity Catalog Loading Error: %s", exc)
    return catalog


def extract_ref_links(content: str) -> Dict[str, str]:
    return {rid.lower().strip(): url.strip() for rid, url in _RAW_REF_RE.findall(content)}
