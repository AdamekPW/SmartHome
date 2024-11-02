from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_socketio import SocketIO, send

import threading
import time
import random
import signal
import sys

import asyncio
import websockets

# Konfiguracja aplikacji
app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///test.db"
db = SQLAlchemy(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="gevent")


# Klasa reprezentująca tabelę w bazie danych
class TempSample(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    temp = db.Column(db.Float, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return "<TempSample %r>" % self.id


# Tworzenie bazy danych (odkomentuj za pierwszym razem jesli bazy nie ma w repozytorium)

# with app.app_context():
#     db.create_all()


# Dodanie próbki temperatury do bazy danych oraz jej wyświetlenie na stronie backendu
@app.route("/", methods=["POST", "GET"])
def index():
    temps = TempSample.query.order_by(TempSample.date_created).all()
    return render_template("index.html", temps=temps)


# Usuwanie próbki temperatury z bazy danych
@app.route("/delete/<int:id>")
def delete(id):
    temp_to_delete = TempSample.query.get_or_404(id)

    try:
        db.session.delete(temp_to_delete)
        db.session.commit()
        return redirect("/")
    except:
        return "There was a problem deleting that temperature sample"


# Wydarzenie, gdy klient połączy się z serwerem
@socketio.on("connect")
def handle_connect():
    print("Klient połączony")
    send("Witaj, jesteś połączony z serwerem!")


@socketio.on("toggleState")
def handle_toggle_state(state):
    print(f"Stan przycisku: {state}")


# Flaga kontrolująca działanie wątku
stop_thread = False


# Funkcja obsługująca zamknięcie aplikacji
def stop_threads(*args):
    global stop_thread
    stop_thread = True
    print("Zamykanie aplikacji i wątku...")
    sys.exit(0)


signal.signal(signal.SIGINT, stop_threads)  # Obsługa Ctrl+C


async def handle_connection(websocket):
    print("Client connected")
    try:
        async for message in websocket:
            print(f"Received message: {message}")
            # Zapisanie odczytu do bazy danych
            new_sample = TempSample(temp=float(message))
            with app.app_context():
                db.session.add(new_sample)
                db.session.commit()
                socketio.emit("temperature_update", {"temp": float(message)})
                print(f"Przesłano na frontend: {float(message)}°C")

            await websocket.send(f"Echo: {message}")  # Odesłanie wiadomości
    except websockets.ConnectionClosed:
        print("Client disconnected")


def run_websocket_server():
    asyncio.set_event_loop(
        asyncio.new_event_loop()
    )  # Create a new event loop for this thread
    loop = asyncio.get_event_loop()
    start_server = websockets.serve(handle_connection, "0.0.0.0", 8000)

    loop.run_until_complete(start_server)
    print("WebSocket server started on ws://0.0.0.0:8000")
    loop.run_forever()


if __name__ == "__main__":
    # Uruchomienie serwera WebSocket w osobnym wątku
    websocket_thread = threading.Thread(target=run_websocket_server)
    websocket_thread.daemon = True
    websocket_thread.start()

    socketio.run(app, host="127.0.0.1", port=7000)
