import logging
from pathlib import Path
import re
from typing import Dict

logger = logging.getLogger(__name__)

DEFAULT_KNOWLEDGE_DIR = Path(__file__).resolve().parent.parent / "knowledge"
KNOWLEDGE_FILES = ("speaker-talk.md", "partner-sponsor.md", "programma-logistica.md", "visione-concept.md")

_MARKDOWN_REF_RE = re.compile(r"\[\[REF:(.*?)\]\].*?\((https?://.*?)\)")
_RAW_REF_RE = re.compile(r"\[\[REF:(.*?)\]\].*?(https?://[^\s\)\],<>]+)")
_META_LINK_RE = re.compile(r'"id":\s*"(.*?)".*?"(?:web|links)":\s*(?:"(.*?)"|\[(.*?)\])')
_FIRST_QUOTED_URL_RE = re.compile(r'"(https?://.*?)"')


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


def extract_ref_links(content: str) -> Dict[str, str]:
    return {rid.lower().strip(): url.strip() for rid, url in _RAW_REF_RE.findall(content)}
