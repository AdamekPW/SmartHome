import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import styles from "./styles/App.module.scss";
import io from "socket.io-client";
import Button from "./button";

// Połączenie z serwerem WebSocket (Flask-SocketIO)
const socket = io("http://localhost:7000");

const App = () => {
    const [temp, setTemp] = useState("");

    useEffect(() => {
        // Odbieranie wiadomości od serwera
        socket.on("temperature_update", (data) => {
            console.log("Otrzymano probke temperatury:", data);
            setTemp(data);
        });

        // Czyszczenie socketu po odłączeniu komponentu
        return () => {
            socket.off("temperature_update");
        };
    }, []);

    return (
        <main>
            <Button />
            <p>Temperatura: {temp.temp} °C</p>
        </main>
    );
};

export default App;
