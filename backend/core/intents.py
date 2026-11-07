import re
from typing import Dict, Optional

from core.edition import Edition, FestivalDay

GREETINGS = frozenset({"ciao", "buongiorno", "hey"})
SPONSOR_KEYWORDS = ("sponsor", "partner", "sostengono", "loghi", "chi supporta")
SPEAKER_KEYWORDS = ("speaker", "protagonisti", "chi parla", "nomi", "ospiti", "chi è", "chi sono", "parlano")
PROGRAM_KEYWORDS = ("programma", "calendario", "cosa succede", "cosa c'è", "attività")
SOCIAL_KEYWORDS = ("social", "instagram", "facebook", "linkedin", "ig", "fb", "segui")
LODGING_KEYWORDS = ("hotel", "dormire", "alloggio", "alloggiare", "b&b", "convento", "convenzionati", "dove stare")
TOTAL_KEYWORDS = ("tutti", "tutto", "completo", "elenco", "lista", "quali sono", "chi sono i", "chi sono gli")
TICKET_KEYWORDS = ("bigliett", "ticket", "eventbrite", "iscriv", "costa", "prezzo")
TEAM_BASE_KEYWORDS = ("organizz", "chi siete", "fiiico", "chi ha fatto", "chi cura", "curatori")

MORNING_RE = re.compile(r"\bmattina\b|\bmattino\b|\bore 09\b|\bore 10\b|\bore 11\b|\bore 12\b")
AFTERNOON_RE = re.compile(r"pomeriggio|pomeirggio|pomerigio|\bore 14\b|\bore 15\b|\bore 16\b|\bore 17\b|\bore 18\b")


def is_greeting(message: str) -> bool:
    return message.lower().strip() in GREETINGS


def detect_intents(message: str, edition: Edition) -> Dict[str, bool]:
    lower = message.lower()
    social = any(k in lower for k in SOCIAL_KEYWORDS)
    lodging = any(k in lower for k in LODGING_KEYWORDS)
    total = any(k in lower for k in TOTAL_KEYWORDS) and not (social or lodging)
    day_intents = {day.key: any(k in lower for k in day.keywords) for day in edition.days}
    team_keywords = TEAM_BASE_KEYWORDS + edition.team.first_names

    return {
        "sponsor": any(k in lower for k in SPONSOR_KEYWORDS),
        "speaker": any(k in lower for k in SPEAKER_KEYWORDS),
        "program": any(k in lower for k in PROGRAM_KEYWORDS),
        **day_intents,
        "morning": bool(MORNING_RE.search(lower)),
        "afternoon": bool(AFTERNOON_RE.search(lower)),
        "total": total,
        "workshop": "workshop" in lower,
        "ticket": any(k in lower for k in TICKET_KEYWORDS),
        "social": social,
        "lodging": lodging,
        "team": any(k in lower for k in team_keywords),
    }


def mentions_specific_member(message: str, edition: Edition) -> bool:
    lower = message.lower()
    return any(name in lower for name in edition.team.all_names)


def requested_day(message: str, intents: Dict[str, bool], edition: Edition) -> Optional[FestivalDay]:
    lower = message.lower()
    for day in edition.days:
        if intents.get(day.key) or (day.loose_match and day.loose_match in lower):
            return day
    return None
