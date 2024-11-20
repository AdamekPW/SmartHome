import React, { useState, useEffect, useRef } from "react";
import styles from "./styles/App.module.scss";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import FanComponent from "./components/FanComponent";
import PlugStripComponent from "./components/PlugStripComponent";
import LedStripComponent from "./components/LedStripComponent/LedStripComponent";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const device_id = "Front";

const App = () => {
    const [selectedModule, setSelectedModule] = useState("home");
    const [temperature, setTemperature] = useState(0);
    const [plugPower, setPlugPower] = useState(0);
    const [ledStripPower, setLedStripPower] = useState(0);
    const clientRef = useRef(null); // Referencja do WebSocket
    const reconnectTimeoutRef = useRef(null); // Referencja do timeouta dla ponownego łączenia
    const url = 'ws://localhost:8765'; // Adres serwera WebSocket

    const connect = () => {
        console.log("Attempting to connect...");
        const client = new W3CWebSocket(url);

        client.onopen = () => {
            console.log(`${device_id} connected to the server.`);
            client.send(device_id);
            clearTimeout(reconnectTimeoutRef.current);
        };

        client.onmessage = (message) => {
            const data = JSON.parse(message.data);
            console.log(`${device_id} received data from server: ${data.command.data}°C`);
            if (data.command.sender_id === "ESP1") {
                setTemperature(parseFloat(data.command.data.toFixed(2)));
            }
            if (data.command.sender_id === "ESP2") {
                setPlugPower(parseFloat(data.command.data.toFixed(2)));
            }
            if (data.command.sender_id === "ESP3") {
                setLedStripPower(parseFloat(data.command.data.toFixed(2)));
            }
        };

        client.onclose = () => {
            console.log(`${device_id} disconnected. Attempting to reconnect...`);
            reconnectTimeoutRef.current = setTimeout(connect, 5000); // Próbuj ponownie połączyć się po 3 sekundach
        };

        client.onerror = (error) => {
            console.error(`${device_id} WebSocket error:`, error);
            client.close();
        };

        clientRef.current = client; // Przechowuj instancję WebSocket
    };

    useEffect(() => {
        connect();

        return () => {
            if (clientRef.current) {
                clientRef.current.close();
            }
            clearTimeout(reconnectTimeoutRef.current);
        };
    }, []);

    const renderModuleComponent = () => {
        switch (selectedModule) {
            case "home":
                return <Home />;
            case "fan":
                return <FanComponent client={clientRef.current} device_id={device_id} temperature={temperature} />;
            case "plugstrip":
                return <PlugStripComponent client={clientRef.current} device_id={device_id} plugPower={plugPower} />;
            case "ledstrip":
                return <LedStripComponent client={clientRef.current} device_id={device_id} ledStripPower={ledStripPower} />;
            default:
                return "home";
        }
    };

    return (
        <main>
            <Navbar selectedModule={selectedModule} onModuleSelect={setSelectedModule} />
            {renderModuleComponent()}
        </main>
    );
};

export default App;