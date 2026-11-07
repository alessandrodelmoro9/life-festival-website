from dataclasses import dataclass
from functools import lru_cache
import json
from pathlib import Path
from typing import Dict, Optional, Tuple

DEFAULT_DATA_DIR = Path(__file__).resolve().parent.parent / "data"


@dataclass(frozen=True)
class TimeSlots:
    morning_start: str = "09:00"
    morning_end: str = "13:30"


@dataclass(frozen=True)
class FestivalDay:
    key: str
    date: str
    keywords: Tuple[str, ...]
    loose_match: str = ""


@dataclass(frozen=True)
class TeamMember:
    first_name: str
    last_name: str
    id: str


@dataclass(frozen=True)
class Team:
    collective_id: str
    collective_ids: Tuple[str, ...]
    members: Tuple[TeamMember, ...]

    @property
    def first_names(self) -> Tuple[str, ...]:
        return tuple(m.first_name for m in self.members)

    @property
    def all_names(self) -> Tuple[str, ...]:
        return tuple(m.first_name for m in self.members) + tuple(
            m.last_name for m in self.members
        )


@dataclass(frozen=True)
class Edition:
    year: int
    greeting: str
    fallback_text: str
    error_text: str
    error_links: Tuple[str, ...]
    system_prompt: str
    time_slots: TimeSlots
    days: Tuple[FestivalDay, ...]
    team: Team
    ticket_url: str
    social_links: Tuple[str, ...]
    lodging_links: Tuple[str, ...]
    registry_id_markers: Tuple[str, ...]
    assets: Dict[str, Optional[str]]

    def day_by_key(self, key: str) -> Optional[FestivalDay]:
        return next((d for d in self.days if d.key == key), None)


@lru_cache(maxsize=4)
def load_edition(data_dir: Path = DEFAULT_DATA_DIR) -> Edition:
    raw = json.loads((data_dir / "edition.json").read_text(encoding="utf-8"))
    system_prompt = (
        (data_dir / "system_prompt.md")
        .read_text(encoding="utf-8")
        .replace("\r\n", "\n")
        .strip()
    )

    slots_raw = raw.get("time_slots") or {}
    time_slots = TimeSlots(
        morning_start=slots_raw.get("morning_start", "09:00"),
        morning_end=slots_raw.get("morning_end", "13:30"),
    )

    days = tuple(
        FestivalDay(
            key=d["key"],
            date=d["date"],
            keywords=tuple(d["keywords"]),
            loose_match=d.get("loose_match", ""),
        )
        for d in raw["days"]
    )
    team_raw = raw["team"]
    team = Team(
        collective_id=team_raw["collective_id"],
        collective_ids=tuple(team_raw["collective_ids"]),
        members=tuple(TeamMember(**m) for m in team_raw["members"]),
    )
    links = raw["links"]

    return Edition(
        year=raw["edition"],
        greeting=raw["greeting"],
        fallback_text=raw["fallback_text"],
        error_text=raw["error_text"],
        error_links=tuple(raw.get("error_links", [links["social"][0]])),
        system_prompt=system_prompt,
        time_slots=time_slots,
        days=days,
        team=team,
        ticket_url=links["ticket"],
        social_links=tuple(links["social"]),
        lodging_links=tuple(links["lodging"]),
        registry_id_markers=tuple(raw["registry_id_markers"]),
        assets=dict(raw["assets"]),
    )
