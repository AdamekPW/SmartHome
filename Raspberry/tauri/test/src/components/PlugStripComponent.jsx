import { useState, useEffect, useContext } from "react";
import styles from "../styles/components/PlugStripComponent.module.scss";
import { GiPlainCircle } from "react-icons/gi";

import Chart from "./Chart";

import { PlugStripLivePowerContext } from "../contexts/PlugStripLivePowerContext";

const PlugStripComponent = ({
    client,
    device_id,
    plugPower,
    plugButtonInfo,
    dbPower,
}) => {
    const [buttonStates, setButtonStates] = useState([false, false, false]);

    const { plugLivePowerData, setPlugLivePowerData } = useContext(
        PlugStripLivePowerContext
    );

    useEffect(() => {
        setPlugLivePowerData((prevState) => {
            const updatedState = [...prevState, plugPower];
            if (updatedState.length > 200) {
                return updatedState.slice(-200);
            }
            return updatedState;
        });
    }, [plugPower]);

    useEffect(() => {
        const newStatesBool = plugButtonInfo.map((info) => info === "1");
        setButtonStates(newStatesBool);
    }, [plugButtonInfo]);

    const toggleCircle = (index) => {
        const newStates = [...buttonStates];
        newStates[index] = !newStates[index];
        setButtonStates(newStates);

        const data = {
            sender_id: device_id,
            data: newStates.map((state) => (state ? "1" : "0")).join("|"),
            target_id: "ESP2",
        };

        client.send(JSON.stringify(data));
    };

    return (
        <div className={styles.PlugContent}>
            <div className={styles.PlugChart}>
                <Chart type={"power"} data={plugLivePowerData} dbData={dbPower}>
                    {" "}
                </Chart>
            </div>
            <div className={styles.ButtonsWithSample}>
                <div className={styles.Plug}>
                    {buttonStates.map((isOn, index) => (
                        <div
                            key={index}
                            className={
                                isOn ? styles.CircleOn : styles.CircleOff
                            }
                            onClick={() => toggleCircle(index)}
                        >
                            <GiPlainCircle className={styles.Dot} />
                            <GiPlainCircle className={styles.Dot} />
                        </div>
                    ))}
                </div>
                <div className={styles.CurrentPowerSample}>{plugPower}W</div>
            </div>
        </div>
    );
};

export default PlugStripComponent;
