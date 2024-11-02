import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import io from 'socket.io-client';
import Button from './Button';

// Połączenie z serwerem WebSocket (Flask-SocketIO)
const socket = io('http://localhost:7000');

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [temp, setTemp] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    // Połączenie WebSocketz
    socket.on('connect', () => {
      console.log('WebSocket połączony');
    });

    // Odbieranie wiadomości od serwera
    socket.on('temperature_update', (data) => {
      console.log('Otrzymano probke temperatury:', data);
      setTemp(data);
    });

    // Czyszczenie socketu po odłączeniu komponentu
    return () => {
      socket.off('connect');
      socket.off('temperature_update');
    };
  }, []);

  const greet = () => {
    // Obsługa formularza (przykładowo)
    setGreetMsg(`Witaj, ${name}`);
  };

  return (
    <main className="container">
      <h1>Welcome to Tauri + React</h1>

      <div className="row">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo vite" alt="Vite logo" />
        </a>
        <a href="https://tauri.app" target="_blank">
          <img src="/tauri.svg" className="logo tauri" alt="Tauri logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <p>Click on the Tauri, Vite, and React logos to learn more.</p>

      {/* Wyświetlanie wiadomości od serwera */}

      <form
        className="row"
        onSubmit={(e) => {
          e.preventDefault();
          greet();
        }}
      >
        <input
          id="greet-input"
          onChange={(e) => setName(e.currentTarget.value)}
          placeholder="Enter a name..."
        />
        <button type="submit">Greet</button>
      </form>
      <p>{greetMsg}</p>
      <Button />
      <p>Temperatura: {temp} °C</p>
    </main>
  );
}

export default App;
