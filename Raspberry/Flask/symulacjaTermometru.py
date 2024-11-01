import asyncio
import websockets
import random
import time


async def send_message(uri, message):
    async with websockets.connect(uri) as websocket:
        await websocket.send(message)
        print(f"Sent message: {message}")

# Example usage
uri = "ws://localhost:8000"
message = "Hello, WebSocket!"
async def send_temperature(uri):
    while True:
        temperature = random.uniform(20.0, 25.0)  # Simulate temperature reading
        message = f"{temperature:.2f}"
        await send_message(uri, message)
        await asyncio.sleep(3)

# Example usage
asyncio.get_event_loop().run_until_complete(send_temperature(uri))
asyncio.get_event_loop().run_until_complete(send_message(uri, message))