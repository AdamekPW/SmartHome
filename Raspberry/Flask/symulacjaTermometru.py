import asyncio
import websockets
import random

uri = "ws://localhost:8000"


async def send_temperature(websocket):
    while True:
        temperature = random.uniform(20.0, 25.0)
        message = f"{temperature:.2f}"
        await websocket.send(message)
        print(f"Sent temperature: {message}°C")
        await asyncio.sleep(3)


async def receive_button_status(websocket):
    async for message in websocket:
        print(f"Received message: {message}")


async def main():
    while True:
        try:
            async with websockets.connect(uri) as websocket:
                await asyncio.gather(
                    send_temperature(websocket), receive_button_status(websocket)
                )
        except websockets.exceptions.ConnectionClosedOK:
            print("Connection closed, reconnecting...")
            await asyncio.sleep(1)


if __name__ == "__main__":
    asyncio.run(main())
