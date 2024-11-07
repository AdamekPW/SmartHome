import { useState, useEffect } from "react";
import styles from "./styles/App.module.scss";
import io from "socket.io-client";
import Button from "./button";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import FanComponent from "./components/FanComponent";
import PlugStripComponent from "./components/PlugStripComponent";
import LedStripComponent from "./components/LedStripComponent/LedStripComponent";

// Połączenie z serwerem WebSocket (Flask-SocketIO)
// const socket = io("http://localhost:7000");

const App = () => {
    const [selectedModule, setSelectedModule] = useState("home"); // in future: main menu probably (component with logo)
    // const [temp, setTemp] = useState("");

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

    // useEffect(() => {
    //     // Odbieranie wiadomości od serwera
    //     socket.on("temperature_update", (data) => {
    //         console.log("Otrzymano probke temperatury:", data);
    //         setTemp(data);
    //     });

    //     // Czyszczenie socketu po odłączeniu komponentu
    //     return () => {
    //         socket.off("temperature_update");
    //     };
    // }, []);

    return (
        <main>
            <Navbar
                selectedModule={selectedModule}
                onModuleSelect={setSelectedModule}
            />
            {renderModuleComponent()}
            {/* <Button /> */}
            {/* <p>Temperatura: {temp.temp} °C</p> */}
        </main>
    );
};

export default App;
