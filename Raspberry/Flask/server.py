import asyncio
import websockets
import json

from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

ESP1_data = ""
ESP2_data = ""
ESP3_data = ""


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

class PowerLED(Base):
    __tablename__ = 'Power'
    sample = Column(Integer)
    created = Column(String, default=lambda: datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), primary_key=True)

class PowerPlug(Base):
    __tablename__ = 'PowerPlug'
    sample = Column(Integer)
    created = Column(String, default=lambda: datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"), primary_key=True)

# Utworzenie tabeli (jeśli jeszcze nie istnieje)
Base.metadata.create_all(engine)


connected_devices = {}
white_list = ['ESP1', 'ESP2', 'ESP3', 'Front']
async def handle_connection(websocket, path):
    # Przypisz ID na podstawie ścieżki połączenia lub wiadomości inicjującej
    sender_id = await websocket.recv()  # Zakładamy, że klient wyśle swój ID zaraz po połączeniu
    connected_devices[sender_id] = websocket
    print(f"Device {sender_id} connected.")
    
    if sender_id == "Front":
        temperature_samples = session.query(Temperature.sample).all()
        power_led_samples = session.query(PowerLED.sample).all()
        power_plug_samples = session.query(PowerPlug.sample).all()
        data_to_send = {
            "temperature_samples": [sample[0] for sample in temperature_samples],
            "power_led_samples": [sample[0] for sample in power_led_samples],
            "power_plug_samples": [sample[0] for sample in power_plug_samples]
        }

        data = {
            "sender_id": "server",
            "target_id": "Front",
            "data": data_to_send
        }
        await websocket.send(json.dumps(data))
        
    if sender_id == "ESP1":
        await websocket.send(json.dumps(ESP1_data))
    if sender_id == "ESP2":
        await websocket.send(json.dumps(ESP2_data))
    if sender_id == "ESP3":
        await websocket.send(json.dumps(ESP3_data))


    try:
        async for message in websocket:
            data = json.loads(message)
            await process_device_data(data)
    except websockets.exceptions.ConnectionClosed as e:
        print(f"Connection closed for {sender_id}: {e}")
    finally:
        # Potrzebne w celu naprawienia buga
        await connected_devices[sender_id].close()
        # Usuń urządzenie po rozłączeniu
        del connected_devices[sender_id]
        print(f"Device {sender_id} disconnected.")

async def send_command_to_device(sender_id, command):
    if sender_id in connected_devices:
        try:
            if (command["target_id"] == "Front"):
                await connected_devices[sender_id].send(json.dumps(command))
            else:
                await connected_devices[sender_id].send(command["data"])
            #print(f"Sent command to {sender_id}: {command}")
        except websockets.exceptions.ConnectionClosed as e:
            print(f"Failed to send command to {sender_id}, connection closed: {e}")
            del connected_devices[sender_id]
    else:
        print(f"Device {sender_id} not connected.")

async def process_device_data(data):
    # Weryfikacja, że dane są w prawidłowym formacie
    if "data" not in data:
        print("Invalid data format received.")
        return
    sender_id = data.get("sender_id")
    target_id = data.get("target_id")

    
    if sender_id == "Front" and target_id == "ESP1":

        print(f"Received button state data from {sender_id}: {data['data']}")
        await send_command_to_device(target_id, data)
        ESP1_data = data['data']
        print(f"Sent button data to {target_id}: button state: {data['data']}")
        
    elif sender_id == "ESP1" and target_id == "Front":
        print(f"Received temperature data from {sender_id}: {data['data']}°C")

        # try:
        #     new_sample = Temperature(sample=data['data'])
        #     session.add(new_sample)
        #     session.commit()
        # except Exception as e:
        #     print(f"Failed to save temperature data to database: {e}")

        await send_command_to_device(target_id, data)
        print(f"Sent temperature data to {target_id}: {data['data']}°C")

    elif sender_id == "ESP2" and target_id == "Front":

        print(f"Received power data from {sender_id}: {data['data']}W")

        # try:
        #     new_sample = PowerPlug(sample=data['data'])
        #     session.add(new_sample)
        #     session.commit()
        # except Exception as e:
        #     print(f"Failed to save power data to database: {e}")

        await send_command_to_device(target_id, data)
        print(f"Sent power data to {target_id}: {data['data']}W")

    elif sender_id == "Front" and target_id == "ESP2":
            
            print(f"Received button state data from {sender_id}: {data['data']}")
            await send_command_to_device(target_id, data)
            ESP2_data = data['data']
            print(f"Sent button data to {target_id}: button state: {data['data']}")

    elif sender_id == "ESP3" and target_id == "Front":

        print(f"Received power data from {sender_id}: {data['data']}W")

        # try:
        #     new_sample = PowerLED(sample=data['data'])
        #     session.add(new_sample)
        #     session.commit()
        # except Exception as e:
        #     print(f"Failed to save power data to database: {e}")
# 

        await send_command_to_device(target_id, data)
        print(f"Sent power data to {target_id}: {data['data']}W")

    elif sender_id == "Front" and target_id == "ESP3":

        print(f"Received button state data from {sender_id}: {data['data']}")
        await send_command_to_device(target_id, data)
        ESP3_data = data['data']
        print(f"Sent button data to {target_id}: button state: {data['data']}")


# Start serwera WebSocket
async def main():
    async with websockets.serve(handle_connection, "0.0.0.0", 8765):
        print("WebSocket server is running on ws://0.0.0.0:8765")
        await asyncio.Future()  # keep running

# Uruchomienie serwera
asyncio.run(main())
