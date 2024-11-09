import asyncio
import websockets
import json

connected_devices = {}

async def handle_connection(websocket, path):
    # Przypisz ID na podstawie ścieżki połączenia lub wiadomości inicjującej
    device_id = await websocket.recv()  # Zakładamy, że klient wyśle swój ID zaraz po połączeniu
    connected_devices[device_id] = websocket
    print(f"Device {device_id} connected.")

    try:
        async for message in websocket:
            data = json.loads(message)
            await process_device_data(device_id, data)
    except websockets.exceptions.ConnectionClosed as e:
        print(f"Connection closed for {device_id}: {e}")
    finally:
        # Usuń urządzenie po rozłączeniu
        del connected_devices[device_id]
        print(f"Device {device_id} disconnected.")

async def send_command_to_device(device_id, command):
    if device_id in connected_devices:
        try:
            await connected_devices[device_id].send(json.dumps({"command": command}))
            #print(f"Sent command to {device_id}: {command}")
        except websockets.exceptions.ConnectionClosed as e:
            print(f"Failed to send command to {device_id}, connection closed: {e}")
            del connected_devices[device_id]
    else:
        print(f"Device {device_id} not connected.")

async def process_device_data(device_id, data):
    # Weryfikacja, że dane są w prawidłowym formacie
    if "data" not in data:
        print("Invalid data format received.")
        return
    
    if device_id == "Front":
        print(f"Received button state data from {device_id}: {data['data']}")
        await send_command_to_device("Temp", data)
        print(f"Sent button data to Temp: button state: {data['data']}")
    elif device_id == "Temp":
        print(f"Received temperature data from {device_id}: {data['data']}°C")
        await send_command_to_device("Front", data)
        print(f"Sent temperature data to Front: {data['data']}°C")

# Start serwera WebSocket
async def main():
    async with websockets.serve(handle_connection, "0.0.0.0", 8765):
        print("WebSocket server is running on ws://0.0.0.0:8765")
        await asyncio.Future()  # keep running

# Uruchomienie serwera
asyncio.run(main())
