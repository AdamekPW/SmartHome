import asyncio
import websockets
import json

from sqlalchemy import create_engine, Column, Integer, String, func
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import datetime

ESP1_data = ""
ESP2_data = "0|0|0"
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
    __tablename__ = 'PowerLED'
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
async def send_to_front(command):
    for key in connected_devices:
        if key.startswith('Front|'):
            await connected_devices[key].send(json.dumps(command))

async def handle_connection(websocket, path):
    # Przypisz ID na podstawie ścieżki połączenia lub wiadomości inicjującej
    sender_id = await websocket.recv()  # Zakładamy, że klient wyśle swój ID zaraz po połączeniu
    sender_id_original = sender_id
    connected_devices[sender_id] = websocket
    result = sender_id.split('|')[0]
    if (result == "Front"):
        sender_id = result
       
    print(f"Device {sender_id} connected.")
    

    if sender_id == "Front":
        current_month = datetime.datetime.now().strftime("%Y-%m")

        temperature_daily_avg = (
            session.query(
                func.date(Temperature.created).label("day"),
                func.avg(Temperature.sample).label("average")
            )
            .filter(Temperature.created.like(f"{current_month}%"))
            .group_by(func.date(Temperature.created))
            .all()
        )

        power_led_daily_avg = (
            session.query(
                func.date(PowerLED.created).label("day"),
                func.avg(PowerLED.sample).label("average")
            )
            .filter(PowerLED.created.like(f"{current_month}%"))
            .group_by(func.date(PowerLED.created))
            .all()
        )

        power_plug_daily_avg = (
            session.query(
                func.date(PowerPlug.created).label("day"),
                func.avg(PowerPlug.sample).label("average")
            )
            .filter(PowerPlug.created.like(f"{current_month}%"))
            .group_by(func.date(PowerPlug.created))
            .all()
        )
        
        days_in_month = 31
        
        temperature_avg_by_day = [0] * days_in_month
        for day, avg in temperature_daily_avg:
            day_index = int(day.split('-')[-1]) - 1
            temperature_avg_by_day[day_index] = avg

        power_led_avg_by_day = [0] * days_in_month
        for day, avg in power_led_daily_avg:
            day_index = int(day.split('-')[-1]) - 1
            power_led_avg_by_day[day_index] = avg

        power_plug_avg_by_day = [0] * days_in_month
        for day, avg in power_plug_daily_avg:
            day_index = int(day.split('-')[-1]) - 1
            power_plug_avg_by_day[day_index] = avg

        data_to_send = {
            "temperature_samples": temperature_avg_by_day,
            "power_led_samples": power_led_avg_by_day,
            "power_plug_samples":  power_plug_avg_by_day
        }
        data = {
            "sender_id": "server",
            "target_id": "Front",
            "data": data_to_send
        }
        await websocket.send(json.dumps(data))
        
    if sender_id == "ESP1":
        await websocket.send(ESP1_data)
    if sender_id == "ESP2":
        await websocket.send(ESP2_data)
    if sender_id == "ESP3":
        await websocket.send(ESP3_data)


    try:
        async for message in websocket:
            data = json.loads(message)
            await process_device_data(data)
    except websockets.exceptions.ConnectionClosed as e:
        print(f"Connection closed for {sender_id_original}: {e}")
    finally:
        # Potrzebne w celu naprawienia buga
        try: 
            await connected_devices[sender_id_original].close()
            del connected_devices[sender_id_original]
        except Exception as e:
            pass 
        # Usuń urządzenie po rozłączeniu
        print(f"Device {sender_id_original} disconnected.")

async def send_command_to_device(target_id, command):
    found = False
    if target_id in connected_devices:
        found = True
    elif target_id == 'Front':
        for key in connected_devices:
            if key.startswith('Front|'):
                found = True
    
    if not found:
        print(f"Device {target_id} not connected.")
        return
    try:
        if (command["target_id"] == "Front"):
            await send_to_front(command)
            #await connected_devices[sender_id].send(json.dumps(command))
        else:
            await connected_devices[target_id].send(command["data"])
        #print(f"Sent command to {sender_id}: {command}")
    except websockets.exceptions.ConnectionClosed as e:
        print(f"Failed to send command to {target_id}, connection closed: {e}")
        del connected_devices[target_id]

async def process_device_data(data):
    global ESP1_data, ESP2_data, ESP3_data
    # Weryfikacja, że dane są w prawidłowym formacie
    if "data" not in data:
        print("Invalid data format received.")
        return
    sender_id = data.get("sender_id")
    target_id = data.get("target_id")
   
    result = sender_id.split('|')[0]
    if (result == "Front"):
        sender_id = result
    
    if sender_id == "Front" and target_id == "ESP1":

        print(f"Received button state data from {sender_id}: {data['data']}")
        await send_command_to_device(target_id, data)
        ESP1_data = data['data']
        print(f"Sent button data to {target_id}: button state: {data['data']}")
        
    elif sender_id == "ESP1" and target_id == "Front":
        if float(data['data']) > -100:
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
        parts = data['data'].rsplit('|', 1)  
        buttons_info = parts[0]  
        power_info = parts[1]
        if float(power_info) < 0:
            power_info = '0'

        if (float(power_info) != -1.0):
            data['data'] = buttons_info+'|'+power_info
        # try:
        #     new_sample = PowerPlug(sample=power_info)
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
        if float(data['data']) < 0:
            data['data'] = '0'

        # try:
        #     new_sample = PowerLED(sample=data['data'])
        #     session.add(new_sample)
        #     session.commit()
        # except Exception as e:
        #     print(f"Failed to save power data to database: {e}")

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
