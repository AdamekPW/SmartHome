import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import styles from "../styles/components/FanComponent.module.scss";

const FanComponent = () => {
    const [isOn, setIsOn] = useState(false);
    const handleToggle = () => {
        const newState = !isOn;
        setIsOn(newState);
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
                    <span className={styles.TempText}>XC</span>
                </div>
            </div>
        </div>
    );
};

export default FanComponent;
