import React, { useState, useEffect } from "react";
import styles from "../styles/components/FanComponent.module.scss";

import Chart from "./Chart";

const FanComponent = ({ client, device_id, temperature, dbTemperature }) => {
    const [isOn, setIsOn] = useState(false);
    const [temperatureLiveData, setTemperatureLiveData] = useState([])

    useEffect(() => {
        setTemperatureLiveData(prevState => [...prevState, temperature])
    }, [temperature])

    const handleToggle = () => {
        const newState = !isOn;
        setIsOn(newState);
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
                <Chart type={"temperature"} data={temperatureLiveData} dbData={dbTemperature} />
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