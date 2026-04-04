from typing import List, Optional
from pydantic import BaseModel

class Game(BaseModel):
    room_id: str
    board: List[Optional[str]]
    turn: str
    winner: Optional[str] = None