from db import db
from models.game import Game

collection = db.games


def calculate_winner(board):
    lines = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ]
    for a, b, c in lines:
        if board[a] and board[a] == board[b] == board[c]:
            return board[a]
    return None


async def get_or_create_game(room_id: str):
    game = await collection.find_one({"room_id": room_id})

    if not game:
        new_game = Game(
            room_id=room_id,
            board=[None]*9,
            turn="X"
        )
        await collection.insert_one(new_game.dict())
        return new_game.dict()

    return game


async def make_move(room_id: str, index: int, player: str):
    game = await collection.find_one({"room_id": room_id})
    if not game:
        return None

    if game["winner"]:
        return game

    if game["board"][index] is not None:
        return game

    if game["turn"] != player:
        return game

    game["board"][index] = player
    game["winner"] = calculate_winner(game["board"])
    game["turn"] = "O" if player == "X" else "X"

    await collection.update_one(
        {"room_id": room_id},
        {"$set": game}
    )

    return game