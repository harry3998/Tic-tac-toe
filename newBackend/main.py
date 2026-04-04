from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from websocket.manager import manager
from services.game_service import get_or_create_game, make_move

app = FastAPI()


@app.websocket("/ws/{room_id}")
async def websocket_endpoint(websocket: WebSocket, room_id: str):
    await manager.connect(room_id, websocket)

    # Send initial game state
    game = await get_or_create_game(room_id)
    await manager.broadcast(room_id, game)

    try:
        while True:
            data = await websocket.receive_json()

            if data["type"] == "move":
                game = await make_move(
                    room_id,
                    data["index"],
                    data["player"]
                )

                await manager.broadcast(room_id, game)

    except WebSocketDisconnect:
        manager.disconnect(room_id, websocket)