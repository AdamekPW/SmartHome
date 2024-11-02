import asyncio
import websockets
import random

# WebSocket server URI
uri = "ws://localhost:8000"


# Function to send temperature data
async def send_temperature(websocket):
    while True:
        temperature = random.uniform(20.0, 25.0)  # Simulate temperature reading
        message = f"{temperature:.2f}"
        await websocket.send(message)
        print(f"Sent temperature: {message}°C")
        await asyncio.sleep(3)


# Function to receive messages (like button state)
async def receive_button_status(websocket):
    async for message in websocket:
        print(f"Received message: {message}")


# Main function to connect to the WebSocket server and handle both sending and receiving
async def main():
    async with websockets.connect(uri) as websocket:
        # Run both sending and receiving in parallel
        await asyncio.gather(
            send_temperature(websocket),  # Task to send temperature data
            receive_button_status(
                websocket
            ),  # Task to receive messages (e.g., button state)
        )


# Run the main function
if __name__ == "__main__":
    asyncio.run(main())
