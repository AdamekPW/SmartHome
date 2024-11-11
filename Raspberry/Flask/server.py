import asyncio
import websockets
import json

from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

# Utworzenie lokalnej bazy danych SQLite
engine = create_engine('sqlite:///device_data.db')  # Baza danych zostanie utworzona jako plik `device_data.db`
Base = declarative_base()
Session = sessionmaker(bind=engine)
session = Session()

# Definicja modelu tabeli
class Temperature(Base):
    __tablename__ = 'Temperature'
    sample = Column(Integer)
    created = Column(String, default=lambda: datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), primary_key=True)

class Button(Base):
    __tablename__ = 'Button'
    id = Column(Integer, primary_key=True, autoincrement=True)
    mode = Column(String)
    created = Column(String, default=lambda: datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"))

# Utworzenie tabeli (jeśli jeszcze nie istnieje)
Base.metadata.create_all(engine)


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

        try:
            new_sample = Button(mode=data['data'])
            session.add(new_sample)
            session.commit()
        except Exception as e:
            print(f"Failed to save button state data to database: {e}")

        await send_command_to_device("Temp", data)
        print(f"Sent button data to Temp: button state: {data['data']}")
    elif device_id == "Temp":
        print(f"Received temperature data from {device_id}: {data['data']}°C")

        try:
            new_sample = Temperature(sample=data['data'])
            session.add(new_sample)
            session.commit()
        except Exception as e:
            print(f"Failed to save temperature data to database: {e}")

        await send_command_to_device("Front", data)
        print(f"Sent temperature data to Front: {data['data']}°C")

# Start serwera WebSocket
async def main():
    async with websockets.serve(handle_connection, "0.0.0.0", 8765):
        print("WebSocket server is running on ws://0.0.0.0:8765")
        await asyncio.Future()  # keep running

# Uruchomienie serwera
asyncio.run(main())
