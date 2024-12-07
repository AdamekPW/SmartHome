import { useState, useEffect, useContext } from "react";
import styles from "../styles/components/PlugStripComponent.module.scss";
import { GiPlainCircle } from "react-icons/gi";
import { BiSolidCircleHalf } from "react-icons/bi";
import Chart from "./Chart";

import { PlugStripLivePowerContext } from "../contexts/PlugStripLivePowerContext";

const PlugStripComponent = ({
    client,
    device_id,
    plugPower,
    plugButtonInfo,
    dbPower,
}) => {
    const [isOn1, setIsOn1] = useState(() => {
        const savedState = localStorage.getItem("plugState1");
        return savedState !== null ? JSON.parse(savedState) : false;
    });
    const [isOn2, setIsOn2] = useState(() => {
        const savedState = localStorage.getItem("plugState2");
        return savedState !== null ? JSON.parse(savedState) : false;
    });
    const [isOn3, setIsOn3] = useState(() => {
        const savedState = localStorage.getItem("plugState3");
        return savedState !== null ? JSON.parse(savedState) : false;
    });

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
        localStorage.setItem("plugState1", plugButtonInfo[0] === "1");
        localStorage.setItem("plugState2", plugButtonInfo[1] === "1");
        localStorage.setItem("plugState3", plugButtonInfo[2] === "1");
    }, [plugButtonInfo]);

    const toggleCircle1 = () => {
        const newState = !isOn1;
        localStorage.setItem("plugState1", newState);
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
        localStorage.setItem("plugState2", newState);
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
        localStorage.setItem("plugState3", newState);
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
                    <div className={styles.DotsContainer}>
                        <GiPlainCircle className={styles.Dot} />
                        <BiSolidCircleHalf className={`${styles.Icon} ${styles.CenterIcon}`} />
                        <GiPlainCircle className={styles.Dot} />
                    </div>
                    </div>
        
                    <div
                        className={isOn2 ? styles.CircleOn : styles.CircleOff}
                        onClick={toggleCircle2}
                    >
                        <div className={styles.DotsContainer}>
                            <GiPlainCircle className={styles.Dot} />
                            <BiSolidCircleHalf className={`${styles.Icon} ${styles.CenterIcon}`} />
                            <GiPlainCircle className={styles.Dot} />
                        </div>
                    </div>
        
                    <div
                        className={isOn3 ? styles.CircleOn : styles.CircleOff}
                        onClick={toggleCircle3}
                    >
                        <div className={styles.DotsContainer}>
                            <GiPlainCircle className={styles.Dot} />
                            <BiSolidCircleHalf className={`${styles.Icon} ${styles.CenterIcon}`} />
                            <GiPlainCircle className={styles.Dot} />
                        </div>
                    </div>
                </div>

                <div className={styles.CurrentPowerSample}>300.99W</div>
            </div>
        </div>
    );
};

export default PlugStripComponent;
