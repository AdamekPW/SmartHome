import asyncio
import websockets
import json
import random

async def client():
    uri = "ws://localhost:8765"
    device_id = "Temp"

    async with websockets.connect(uri) as websocket:
        # Wysyłamy swój device_id zaraz po połączeniu
        await websocket.send(device_id)
        print(f"{device_id} connected to the server.")
        
        # Wysyłanie danych i odbieranie wiadomości równolegle
        await asyncio.gather(
            send_temperature_data(websocket, device_id),
            receive_data(websocket, device_id)
        )

async def send_temperature_data(websocket, device_id):
    while True:
        # Generowanie losowej temperatury
        temperature = round(random.uniform(20.0, 25.0), 2)
        data = {
            "device_id": device_id,
            "data": temperature
        }
        # Wysyłamy dane do serwera
        await websocket.send(json.dumps(data))
        print(f"{device_id} sent temperature data: {temperature}°C")
        
        # Czekamy 5 sekund przed wysłaniem kolejnej wartości
        await asyncio.sleep(random.randint(2, 8))

async def receive_data(websocket, device_id):
    while True:
        try:
            # Odbieramy wiadomości od serwera
            message = await websocket.recv()
            data = json.loads(message)
            print(f"{device_id} received data from server: {data['command']['data']}°C")
        except websockets.exceptions.ConnectionClosed:
            print(f"{device_id} disconnected from server.")
            break

# Uruchomienie klienta
asyncio.run(client())
