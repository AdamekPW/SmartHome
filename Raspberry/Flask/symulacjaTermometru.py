import asyncio
import websockets
import random

async def send_temperature(websocket):
    try:
        while True:
            temperature = random.uniform(20.0, 25.0)
            temp_sample = f"{temperature:.2f}"
            await websocket.send(temp_sample)
            print(f"Sent temperature: {temp_sample}°C")
            await asyncio.sleep(3)
    except websockets.ConnectionClosedOK:
        print("Connection closed gracefully in send_temperature.")

async def receive_button_status(websocket):
    try:
        while True:
            button_status = await websocket.recv()  # Await receiving the next message
            print(f"Received button status: {button_status}")
    except websockets.ConnectionClosedOK:
        print("Connection closed gracefully in receive_button_status.")

async def handler(websocket):
    try:
        await asyncio.gather(
            send_temperature(websocket),
            receive_button_status(websocket),
        )
    except websockets.ConnectionClosedOK:
        print("Connection closed gracefully in handler.")

async def main():
    server = await websockets.serve(handler, "localhost", 8000)
    print("Server started on ws://localhost:8000")
    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())