from dataclasses import dataclass
import json
from pathlib import Path
from types import MappingProxyType
from typing import Mapping, Optional, Tuple

DEFAULT_DATA_DIR = Path(__file__).resolve().parent.parent / "data"


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
        return tuple(m.first_name for m in self.members) + tuple(m.last_name for m in self.members)


@dataclass(frozen=True)
class Edition:
    year: int
    greeting: str
    fallback_text: str
    error_text: str
    error_links: Tuple[str, ...]
    system_prompt: str
    morning_start: str
    morning_end: str
    days: Tuple[FestivalDay, ...]
    team: Team
    ticket_url: str
    social_links: Tuple[str, ...]
    lodging_links: Tuple[str, ...]
    registry_id_markers: Tuple[str, ...]
    assets: Mapping[str, Optional[str]]


def load_edition(data_dir: Path = DEFAULT_DATA_DIR) -> Edition:
    raw = json.loads((data_dir / "edition.json").read_text(encoding="utf-8"))
    system_prompt = (data_dir / "system_prompt.md").read_text(encoding="utf-8").replace("\r\n", "\n").strip()
    slots = raw["time_slots"]
    days = tuple(
        FestivalDay(key=d["key"], date=d["date"], keywords=tuple(d["keywords"]), loose_match=d.get("loose_match", ""))
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
        error_links=tuple(raw["error_links"]),
        system_prompt=system_prompt,
        morning_start=slots["morning_start"],
        morning_end=slots["morning_end"],
        days=days,
        team=team,
        ticket_url=links["ticket"],
        social_links=tuple(links["social"]),
        lodging_links=tuple(links["lodging"]),
        registry_id_markers=tuple(raw["registry_id_markers"]),
        assets=MappingProxyType(dict(raw["assets"])),
    )
