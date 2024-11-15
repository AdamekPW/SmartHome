import { useState } from "react";
import styles from "../styles/components/PlugStripComponent.module.scss";
import { GiPlainCircle } from "react-icons/gi";

const PlugStripComponent = ({client, device_id, plugPower}) => {
    const [isOn1, setIsOn1] = useState(false);
    const [isOn2, setIsOn2] = useState(false);

    const toggleCircle1 = () => {
        const newState = !isOn1;
        setIsOn1(newState);
        console.log("Stan przycisku 1:", newState ? "ON" : "OFF");
        const data = {
            sender_id: device_id,
            data: (newState ? "ON" : "OFF") + "/" + (isOn2 ? "ON" : "OFF"),
            "target_id": "ESP2"
        };
        client.send(JSON.stringify(data));
    };

    const toggleCircle2 = () => {
        const newState = !isOn2;
        setIsOn2(newState);
        console.log("Stan przycisku 2:", newState ? "ON" : "OFF");
        const data = {
            sender_id: device_id,
            data: (isOn1 ? "ON" : "OFF") + "/" + (newState ? "ON" : "OFF"),
            "target_id": "ESP2"
        };
        client.send(JSON.stringify(data));
    };

    return (
        <div className={styles.PlugContent}>
            <div className={styles.PlugChart}>
                {plugPower}W
            </div>

            <div className={styles.Plug}>
                <div
                    className={isOn1 ? styles.CircleOn : styles.CircleOff}
                    onClick={toggleCircle1}
                >
                    <GiPlainCircle className={styles.Dot} />
                    <GiPlainCircle className={styles.Dot} />
                </div>

                <div
                    className={isOn2 ? styles.CircleOn : styles.CircleOff}
                    onClick={toggleCircle2}
                >
                    <GiPlainCircle className={styles.Dot} />
                    <GiPlainCircle className={styles.Dot} />
                </div>
            </div>
        </div>
    );
};

export default PlugStripComponent;
