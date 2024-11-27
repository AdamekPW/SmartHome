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
    const [isOn1, setIsOn1] = useState(false);
    const [isOn2, setIsOn2] = useState(false);
    const [isOn3, setIsOn3] = useState(false);

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
        if (plugButtonInfo[0] === "1") setIsOn1(true);
        else setIsOn1(false);
        if (plugButtonInfo[1] === "1") setIsOn2(true);
        else setIsOn2(false);
        if (plugButtonInfo[2] === "1") setIsOn3(true);
        else setIsOn3(false);
    }, [plugButtonInfo]);

    const toggleCircle1 = () => {
        const newState = !isOn1;
        setIsOn1(newState);
        console.log("Stan przycisku 1:", newState ? "1" : "0");
        const data = {
            sender_id: device_id,
            data:
                (newState ? "1" : "0") +
                "|" +
                (isOn2 ? "1" : "0") +
                "|" +
                (isOn3 ? "1" : "0"),
            target_id: "ESP2",
        };
        client.send(JSON.stringify(data));
    };

    const toggleCircle2 = () => {
        const newState = !isOn2;
        setIsOn2(newState);
        console.log("Stan przycisku 2:", newState ? "1" : "0");
        const data = {
            sender_id: device_id,
            data:
                (isOn1 ? "1" : "0") +
                "|" +
                (newState ? "1" : "0") +
                "|" +
                (isOn3 ? "1" : "0"),
            target_id: "ESP2",
        };
        client.send(JSON.stringify(data));
    };

    const toggleCircle3 = () => {
        const newState = !isOn3;
        setIsOn3(newState);
        console.log("Stan przycisku 2:", newState ? "1" : "0");
        const data = {
            sender_id: device_id,
            data:
                (isOn1 ? "1" : "0") +
                "|" +
                (isOn2 ? "1" : "0") +
                "|" +
                (newState ? "1" : "0"),
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

                    <div
                        className={isOn3 ? styles.CircleOn : styles.CircleOff}
                        onClick={toggleCircle3}
                    >
                        <GiPlainCircle className={styles.Dot} />
                        <GiPlainCircle className={styles.Dot} />
                    </div>
                </div>
                <div className={styles.CurrentPowerSample}>{plugPower}W</div>
            </div>
        </div>
    );
};

export default PlugStripComponent;
