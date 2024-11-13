// App.jsx

import React, { useState, useEffect } from "react";
import styles from "./styles/App.module.scss";
import ToggleButton from "./button"; // Zaimportowanie komponentu ToggleButton
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import FanComponent from "./components/FanComponent";
import PlugStripComponent from "./components/PlugStripComponent";
import LedStripComponent from "./components/LedStripComponent";
import Chart from "./components/Chart";
import { w3cwebsocket as W3CWebSocket } from "websocket";

const client = new W3CWebSocket("ws://localhost:8765");
const device_id = "Front";

const App = () => {
    const [selectedModule, setSelectedModule] = useState("home");
    const [buttonState, setButtonState] = useState(false);
    const [temperature, setTemperature] = useState(0);

    const mockTemperatureData = Array.from({ length: 100 }, () =>
        Math.floor(Math.random() * 30 + 10)
    );

    const handleButtonClick = (newState) => {
        setButtonState(newState);
        console.log("Stan przycisku:", newState ? "ON" : "OFF");
        const data = {
            sender_id: device_id,
            data: newState ? "ON" : "OFF",
            target_id: "Temp",
        };
        client.send(JSON.stringify(data));
    };

    useEffect(() => {
        client.onopen = () => {
            console.log(`${device_id} connected to the server.`);
            client.send(device_id);
        };

        client.onmessage = (message) => {
            const data = JSON.parse(message.data);
            console.log(
                `${device_id} received data from server: ${data.command.data}°C`
            );
            if (data.command.sender_id === "Temp") {
                setTemperature(data.command.data);
            }
        };

        return () => {
            client.close();
        };
    }, []);

    const renderModuleComponent = () => {
        switch (selectedModule) {
            case "home":
                return <Home />;
            case "fan":
                return <FanComponent />;
            case "plugstrip":
                return <PlugStripComponent />;
            case "ledstrip":
                return <LedStripComponent />;
            default:
                return "home";
        }
    };

    return (
        <main>
            <Navbar
                selectedModule={selectedModule}
                onModuleSelect={setSelectedModule}
            />
            {renderModuleComponent()}
            <Chart data={mockTemperatureData} type="temperature" />
            <ToggleButton onClick={handleButtonClick} />
            <div className={styles.temperature}>
                <h2>Temperature: {temperature}°C</h2>
            </div>
        </main>
    );
};

export default App;
