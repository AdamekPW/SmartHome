import { useState } from "react";

import styles from "../../styles/components/LedStripComponent/LedStripComponent.module.scss";

import LedStripNavbar from "./LedStipNavbar";

const LedStripComponent = ({client, device_id, ledStripPower}) => {
    const [selectedLedId, setSelectedLedId] = useState(1); // id: 1, mode name: rainbow
    const [isOn, setIsOn] = useState(false);

    const handleToggle = () => {
        const newState = !isOn;
        setIsOn(newState);
        console.log("Stan przycisku:", !newState ? "OFF" : selectedLedId.toString());
        const data = {
            sender_id: device_id,
            data: !newState ? "OFF" : selectedLedId.toString(),
            "target_id": "ESP3"
        };
        client.send(JSON.stringify(data));
    };

    return (
        <div className={styles.container}>
            <LedStripNavbar
                selectedLedId={selectedLedId}
                onSelectLedId={setSelectedLedId}
            />
            <div>
                <p>{selectedLedId}</p>
            </div>
            <div className={styles.FanButton}>
                <button 
                    onClick={handleToggle}
                    className={isOn ? styles.buttonOn : styles.buttonOff}
                >
                    {isOn ? "ON" : "OFF"}
                </button>
                <p>{ledStripPower}</p>
            </div>
        </div>
    );
};

export default LedStripComponent;
