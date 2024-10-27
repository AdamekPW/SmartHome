from flask import Flask, render_template, request, redirect
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_socketio import SocketIO, send

import threading
import time
import random 

# Konfiguracja aplikacji
app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
db = SQLAlchemy(app)
socketio = SocketIO(app, cors_allowed_origins="*")

# Klasa reprezentująca tabelę w bazie danych
class TempSample(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    temp = db.Column(db.Float, nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.utcnow)

    def __repr__(self):
        return '<TempSample %r>' % self.id
    

# Tworzenie bazy danych (odkomentuj za pierwszym razem jesli bazy nie ma w repozytorium)

# with app.app_context():
#     db.create_all()

# Dodanie próbki temperatury do bazy danych oraz jej wyświetlenie na stronie backendu
@app.route('/', methods=['POST', 'GET'])
def index():
    if request.method == 'POST':
        temp_content = request.form['temp']
        new_temp = TempSample(temp=temp_content)

        try:
            db.session.add(new_temp)
            db.session.commit()

            socketio.emit('temperature_update', {'temp': new_temp})

            return redirect('/')
        except:
            return 'There was an issue adding your temperature sample'
    else:
        temps = TempSample.query.order_by(TempSample.date_created).all()
        return render_template('index.html', temps = temps)

# Usuwanie próbki temperatury z bazy danych
@app.route('/delete/<int:id>')
def delete(id):
    temp_to_delete = TempSample.query.get_or_404(id)

    try:
        db.session.delete(temp_to_delete)
        db.session.commit()
        return redirect('/')
    except:
        return 'There was a problem deleting that temperature sample'

# Aktualizacja próbki temperatury w bazie danych
@app.route('/update/<int:id>', methods=['GET', 'POST'])
def update(id):
    temp = TempSample.query.get_or_404(id)

    if request.method == 'POST':
        temp.temp = request.form['temp']

        try:
            db.session.commit()
            return redirect('/')
        except:
            return 'There was an issue updating your temperature sample'

    else:
        return render_template('update.html', temp=temp)
    

# Wydarzenie, gdy klient połączy się z serwerem
@socketio.on('connect')
def handle_connect():
    print('Klient połączony')
    send('Witaj, jesteś połączony z serwerem!')

# Losowanie próbki w osobnym wątku a następnie wysyłanie jej na frontend
def temperature_sensor():
    with app.app_context():
        while True:
            simulated_temp = round(random.uniform(20.0, 25.0), 2)  # Symulowana temperatura
            new_sample = TempSample(temp=simulated_temp)

            print("dzialam")
            # Zapisanie odczytu do bazy danych
            
            db.session.add(new_sample)
            db.session.commit()

            # Wysłanie danych przez socket do klienta
            socketio.emit('temperature_update', {'temp': simulated_temp})
            print(f'Nowa próbka temperatury: {simulated_temp}°C')

            time.sleep(10)  # Czas próbkowania co 10 sekund


if __name__ == '__main__':
    # Uruchomienie funkcji temperature_sensor w osobnym wątku
    sensor_thread = threading.Thread(target=temperature_sensor)
    sensor_thread.daemon = True
    sensor_thread.start()

    socketio.run(app, host='127.0.0.1', port=8000)
