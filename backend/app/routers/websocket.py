from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from app.websocket.manager import manager

router = APIRouter(prefix="/ws", tags=["WebSocket"])


@router.websocket("/dashboard")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Keep connection alive and handle incoming messages
            data = await websocket.receive_text()
            # Echo back or handle specific messages
            await websocket.send_json({"status": "connected", "message": "Dashboard updates active"})
    except WebSocketDisconnect:
        manager.disconnect(websocket)
