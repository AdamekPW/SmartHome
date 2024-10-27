import asyncio
import websockets

#poniższy kod służy do testu połączenia między modułami esp32 a pythonem
async def handle_connection(websocket, path):
    print("Client connected")
    try:
        async for message in websocket:
            print(f"Received message: {message}")
            await websocket.send(f"Echo: {message}")  # Odesłanie wiadomości
    except websockets.ConnectionClosed:
        print("Client disconnected")

# Uruchom serwer WebSocket na porcie 8000
start_server = websockets.serve(handle_connection, "0.0.0.0", 8000)

asyncio.get_event_loop().run_until_complete(start_server)
print("WebSocket server started on ws://0.0.0.0:8000")
asyncio.get_event_loop().run_forever()
