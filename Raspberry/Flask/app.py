from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_socketio import SocketIO, send

import threading

app = Flask(__name__)
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///test.db"
db = SQLAlchemy(app)
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="gevent")


class TempSample(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    temp = db.Column(db.Float, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return "<TempSample %r>" % self.id


@app.route("/", methods=["POST", "GET"])
def index():
    temps = TempSample.query.order_by(TempSample.date_created).all()
    return render_template("index.html", temps=temps)


@app.route("/delete/<int:id>")
def delete(id):
    temp_to_delete = TempSample.query.get_or_404(id)
    try:
        db.session.delete(temp_to_delete)
        db.session.commit()
        return redirect("/")
    except:
        return "There was a problem deleting that temperature sample"


def handle_connection():
    import asyncio
    import websockets

    async def websocket_handler(websocket):
        async for message in websocket:
            new_sample = TempSample(temp=float(message))
            with app.app_context():
                # db.session.add(new_sample)
                # db.session.commit()
                socketio.emit("temperature_update", {"temp": message})
                print(f"Sent to frontend: {message}°C")

    async def start_websocket_server():
        async with websockets.serve(websocket_handler, "0.0.0.0", 8000):
            print("WebSocket server running on ws://localhost:8000")
            await asyncio.Future()

    @socketio.on("toggleState")
    def handle_toggle_state(state):
        print(f"Button state received from frontend: {state}")
        # Forward the button state to the WebSocket server
        asyncio.run(forward_button_state(state))

    async def forward_button_state(state):
        uri = "ws://localhost:8000"
        try:
            async with websockets.connect(uri) as websocket:
                await websocket.send(f"Button State: {state}")
                print(f"Sent button state '{state}' to WebSocket server on port 8000")
        except Exception as e:
            print(f"Error forwarding button state: {e}")

    asyncio.run(start_websocket_server())


def start_websocket_server():
    thread = threading.Thread(target=handle_connection)
    thread.daemon = True
    thread.start()


if __name__ == "__main__":
    start_websocket_server()
    socketio.run(app, host="127.0.0.1", port=7000)
