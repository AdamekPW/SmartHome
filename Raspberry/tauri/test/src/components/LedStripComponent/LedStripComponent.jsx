import { useEffect, useState, useContext } from "react";

import styles from "../../styles/components/LedStripComponent/LedStripComponent.module.scss";

import LedStripNavbar from "./LedStipNavbar";
import Chart from "../Chart";

import { LedStripLivePowerContext } from "../../contexts/LedStripLivePowerContext";

const LedStripComponent = ({ client, device_id, ledStripPower, dbPower }) => {
    const [selectedLedId, setSelectedLedId] = useState(0); // id: 0, mode name: RGB Custom
    const [isOn, setIsOn] = useState(false);
    const [isNavbarOpen, setIsNavbarOpen] = useState(true);
    const [isMobileViewActive, setIsMobileViewActive] = useState(true);

    const { ledLivePowerData, setLedLivePowerData } = useContext(
        LedStripLivePowerContext
    );

    useEffect(() => {
        setLedLivePowerData((prevState) => [...prevState, ledStripPower]);
    }, [ledStripPower]);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 32rem)");

        const handleResize = (e) => {
            setIsMobileViewActive(e.matches);
        };

        setIsMobileViewActive(mediaQuery.matches);

        mediaQuery.addEventListener("change", handleResize);

        return () => {
            mediaQuery.removeEventListener("change", handleResize);
        };
    }, []);

    const handleToggle = () => {
        const newState = !isOn;
        setIsOn(newState);
        console.log(
            "Stan przycisku:",
            !newState ? "OFF" : selectedLedId.toString()
        );
        const data = {
            sender_id: device_id,
            data: !newState ? "OFF" : selectedLedId.toString(),
            target_id: "ESP3",
        };
        client.send(JSON.stringify(data));
    };

    return (
        <div className={styles.container}>
            <LedStripNavbar
                selectedLedId={selectedLedId}
                onSelectLedId={setSelectedLedId}
                isMobileViewActive={isMobileViewActive}
                isNavbarOpen={isNavbarOpen}
                onOpenNavbar={setIsNavbarOpen}
            />
            {isMobileViewActive && isNavbarOpen ? (
                <></>
            ) : (
                <div>
                    <div>
                        <p>{selectedLedId}</p>
                        <div className={styles.ledChart}>
                            <Chart
                                type={"power"}
                                data={ledLivePowerData}
                                dbData={dbPower}
                            ></Chart>
                        </div>
                    </div>
                    <div className={styles.FanButton}>
                        <button
                            onClick={handleToggle}
                            className={
                                isOn ? styles.buttonOn : styles.buttonOff
                            }
                        >
                            {isOn ? "ON" : "OFF"}
                        </button>
                        <p>{ledStripPower}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LedStripComponent;
