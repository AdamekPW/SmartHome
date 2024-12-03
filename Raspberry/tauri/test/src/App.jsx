import React, { useState, useEffect, useRef, useContext } from "react";
import styles from "./styles/App.module.scss";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import FanComponent from "./components/FanComponent";
import PlugStripComponent from "./components/PlugStripComponent";
import LedStripComponent from "./components/LedStripComponent/LedStripComponent";

import { FanLiveTempContext, initialFanLiveTempContext } from "./contexts/FanLiveTempContext";
import { PlugStripLivePowerContext, initialPlugStripLivePowerContext } from "./contexts/PlugStripLivePowerContext";
import { LedStripLivePowerContext, initialLedStripLivePowerContext } from "./contexts/LedStripLivePowerContext";

import { w3cwebsocket as W3CWebSocket } from "websocket";

const device_id = "Front";

const App = () => {
    const [selectedModule, setSelectedModule] = useState("home");
    const [temperature, setTemperature] = useState(0);
    const [plugPower, setPlugPower] = useState(0);
    const [plugButtonInfo, setPlugButtonInfo] = useState(0);
    const [ledStripPower, setLedStripPower] = useState(0);
    const [dbData, setDbData] = useState([]);
    const [fanLiveTempData, setFanLiveTempData] = useState(initialFanLiveTempContext);
    const [plugLivePowerData, setPlugLivePowerData] = useState(initialPlugStripLivePowerContext);
    const [ledLivePowerData, setLedLivePowerData] = useState(initialLedStripLivePowerContext);
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
            console.log(`${device_id} received data from server: ${data.data}`);
            if (data.sender_id === "server") {
                setDbData(data.data);
                console.log(data.data)
            }
            if (data.sender_id === "ESP1") {
                setTemperature(parseFloat(data.data).toFixed(2));
            }
            if (data.sender_id === "ESP2") {
                const [button1, button2, button3, power] = data.data.split("|");
                if (parseFloat(power) === -1){
                    setPlugButtonInfo([button1, button2, button3]);
                } else {
                    setPlugPower(parseFloat(power).toFixed(2));
                }
                console.log(button1, button2, button3, power);
            }
            if (data.sender_id === "ESP3") {
                setLedStripPower(parseFloat(data.data).toFixed(2));
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
                return <FanComponent client={clientRef.current} device_id={device_id} temperature={temperature} dbTemperature={dbData.temperature_samples} />;
            case "plugstrip":
                return <PlugStripComponent client={clientRef.current} device_id={device_id} plugPower={plugPower} plugButtonInfo={plugButtonInfo} dbPower={dbData.power_plug_samples} />;
            case "ledstrip":
                return <LedStripComponent client={clientRef.current} device_id={device_id} ledStripPower={ledStripPower} dbPower={dbData.power_led_samples} />;
            default:
                return "home";
        }
    };

    return (
        <main>
            <FanLiveTempContext.Provider value={{ fanLiveTempData, setFanLiveTempData }}>
                <PlugStripLivePowerContext.Provider value={{ plugLivePowerData, setPlugLivePowerData }}>
                    <LedStripLivePowerContext.Provider value={{ ledLivePowerData, setLedLivePowerData }}>
                        <Navbar selectedModule={selectedModule} onModuleSelect={setSelectedModule} />
                        {renderModuleComponent()}
                    </LedStripLivePowerContext.Provider>
                </PlugStripLivePowerContext.Provider>
            </FanLiveTempContext.Provider>
        </main>
    );
};

export default App;