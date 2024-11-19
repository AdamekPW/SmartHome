import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import styles from "../styles/components/FanComponent.module.scss";

const FanComponent = ({ client, device_id, temperature }) => {
    const [isOn, setIsOn] = useState(false);

    const handleToggle = () => {
        const newState = !isOn;
        setIsOn(newState);
        console.log("Stan przycisku:", newState ? "1" : "1");
        const data = {
            sender_id: device_id,
            data: newState ? "1" : "0",
            "target_id": "ESP1"
        };
        client.send(JSON.stringify(data));
    };

    return (
        <div className={styles.FanContent}>
            <div className={styles.FanChart}>
                {/* Miejsce na wykres + test*/}
            </div>
            <div className={styles.FanInfo}>
                <div className={styles.FanButton}>
                    <button 
                        onClick={handleToggle}
                        className={isOn ? styles.buttonOn : styles.buttonOff}
                    >
                        {isOn ? "ON" : "OFF"}
                    </button>
                </div>
                <div className={styles.TempInfo}>
                    <p>Odczyt temperatury:</p>
                    <br></br>
                    <span className={styles.TempText}>{temperature}°C</span>
                </div>
            </div>
        </div>
    );
};

export default FanComponent;