import { useState, useEffect, useContext } from "react";

import styles from "../../styles/components/LedStripComponent/LedStripComponent.module.scss";

import LedStripNavbar from "./LedStipNavbar";
import LedParametersForm from "./LedParametersForm";

import { ledOptions } from "./ledOptions";

import { LedStripLivePowerContext } from "../../contexts/LedStripLivePowerContext";

const LedStripComponent = ({ client, device_id, ledStripPower }) => {
    const [selectedLedId, setSelectedLedId] = useState(1);
    const [previousLedId, setPreviousLedId] = useState(1);
    const [isNavbarOpen, setIsNavbarOpen] = useState(true);
    const [isMobileViewActive, setIsMobileViewActive] = useState(true);
    const [ledParameters, setLedParameters] = useState("");
    const [isOn, setIsOn] = useState(() => {
        const savedState = localStorage.getItem("ledState");
        return savedState !== null ? JSON.parse(savedState) : false;
    });
    const { ledLivePowerData, setLedLivePowerData } = useContext(
        LedStripLivePowerContext
    );

    useEffect(() => {
        setLedLivePowerData((prevState) => {
            const updatedState = [...prevState, ledStripPower];
            if (updatedState.length > 200) {
                return updatedState.slice(-200);
            }
            return updatedState;
        });
    }, [ledStripPower]);

    useEffect(() => {
        const mediaQuery = window.matchMedia("(max-width: 32rem)");
        const handleResize = (e) => setIsMobileViewActive(e.matches);

        setIsMobileViewActive(mediaQuery.matches);
        mediaQuery.addEventListener("change", handleResize);
        return () => mediaQuery.removeEventListener("change", handleResize);
    }, []);

    const sendData = () => {
        if (ledParameters) {
            const dataString = `${selectedLedId}|${ledParameters}`;
            const data = {
                sender_id: device_id,
                data: dataString,
                target_id: "ESP3",
            };
            client.send(JSON.stringify(data));
        }
    };

    const handleToggle = () => {
        if (isOn) {
            setPreviousLedId(selectedLedId);
            setSelectedLedId(0);
        } else {
            setSelectedLedId(previousLedId);
            sendData();
        }
        console.log(selectedLedId);
        setIsOn((prev) => !prev);
        localStorage.setItem("ledState", !isOn);
        const data = {
            sender_id: device_id,
            data: "0||",
            target_id: "ESP3",
        };
        client.send(JSON.stringify(data));
    };

    return (
        <div className={styles.container}>
            <LedStripNavbar
                selectedLedId={selectedLedId}
                onSelectLedId={setSelectedLedId}
                onSelectPrevioudLedId={setPreviousLedId}
                isMobileViewActive={isMobileViewActive}
                isNavbarOpen={isNavbarOpen}
                onOpenNavbar={setIsNavbarOpen}
            />
            {!isMobileViewActive || !isNavbarOpen ? (
                <div className={styles.containerRight}>
                    {selectedLedId === 0 ? (
                        <h2>Włącz LEDy, aby wybrać tryb</h2>
                    ) : (
                        <div>
                            <h2 className={styles.chosenLed}>
                                Wybrano tryb{" "}
                                {ledOptions[selectedLedId - 1].name}
                            </h2>

                            <LedParametersForm
                                selectedLedId={selectedLedId}
                                onParametersChange={setLedParameters}
                            />
                            <button
                                className={styles.confirmChanges}
                                onClick={sendData}
                            >
                                SEND
                            </button>
                        </div>
                    )}
                    <button
                        onClick={handleToggle}
                        className={isOn ? styles.buttonOn : styles.buttonOff}
                    >
                        {isOn ? "ON" : "OFF"}
                    </button>
                </div>
            ) : null}
        </div>
    );
};

export default LedStripComponent;
