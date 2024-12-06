import { useState, useEffect } from "react";
import styles from "../../styles/components/LedStripComponent/LedParametersForm.module.scss";

import { FaEye } from "react-icons/fa";

const LedParametersForm = ({ selectedLedId, onParametersChange }) => {
    const [brightness, setBrightness] = useState(0.2);
    const [delay, setDelay] = useState(50);
    const [mode, setMode] = useState(0);
    const [time1, setTime1] = useState(50);
    const [time2, setTime2] = useState(4000);
    const [red, setRed] = useState(130);
    const [green, setGreen] = useState(130);
    const [blue, setBlue] = useState(130);

    const eyeIcon = <FaEye />;

    const [expandedSection, setExpandedSection] = useState(null);

    useEffect(() => {
        let parameters = "";
        switch (selectedLedId) {
            case 1:
            case 3:
            case 5:
            case 6:
                parameters = `${brightness.toFixed(2)}|`;
                break;
            case 2:
                parameters = `${brightness.toFixed(2)}|${delay}|`;
                break;
            case 4:
                parameters = `${brightness.toFixed(
                    2
                )}|${mode}|${time1}|${time2}|`;
                break;
            case 7:
                parameters = `${brightness.toFixed(
                    2
                )}|${red}|${green}|${blue}|`;
                break;
            default:
                parameters = "";
        }
        onParametersChange(parameters);
    }, [
        selectedLedId,
        brightness,
        delay,
        mode,
        time1,
        time2,
        red,
        green,
        blue,
        onParametersChange,
    ]);

    const handleSectionClick = (section) => {
        setExpandedSection((prev) => (prev === section ? null : section));
    };

    return (
        <div className={styles.container}>
            {selectedLedId !== 0 && (
                <>
                    <div className={`${styles.section} ${styles.brightness}`}>
                        <div className={styles.header}>
                            <label>Brightness: {brightness}</label>
                            <button
                                className={styles.expandButton}
                                onClick={() => handleSectionClick("brightness")}
                            >
                                {eyeIcon}
                            </button>
                        </div>
                        {expandedSection === "brightness" && (
                            <input
                                type="range"
                                step="0.02"
                                min="0.04"
                                max="1.0"
                                value={brightness}
                                onChange={(e) =>
                                    setBrightness(parseFloat(e.target.value))
                                }
                            />
                        )}
                    </div>

                    {/* Delay Section */}
                    {selectedLedId === 2 && (
                        <div className={`${styles.section} ${styles.delay}`}>
                            <div className={styles.header}>
                                <label>Delay: {delay}</label>
                                <button
                                    className={styles.expandButton}
                                    onClick={() => handleSectionClick("delay")}
                                >
                                    {eyeIcon}
                                </button>
                            </div>
                            {expandedSection === "delay" && (
                                <input
                                    type="range"
                                    step="2"
                                    min="10"
                                    max="200"
                                    value={delay}
                                    onChange={(e) =>
                                        setDelay(parseInt(e.target.value))
                                    }
                                />
                            )}
                        </div>
                    )}

                    {selectedLedId === 4 && (
                        <div className={`${styles.section} ${styles.mode}`}>
                            <div className={styles.header}>
                                <label>Mode: {mode}</label>
                                <button
                                    className={styles.expandButton}
                                    onClick={() => handleSectionClick("mode")}
                                >
                                    {eyeIcon}
                                </button>
                            </div>
                            {expandedSection === "mode" && (
                                <>
                                    <select
                                        value={mode}
                                        onChange={(e) =>
                                            setMode(parseInt(e.target.value))
                                        }
                                    >
                                        <option value={0}>Linear</option>
                                        <option value={1}>
                                            QuadraticInOut
                                        </option>
                                        <option value={2}>CubicInOut</option>
                                        <option value={3}>QuarticInOut</option>
                                        <option value={4}>QuinticInOut</option>
                                        <option value={5}>
                                            SinusoidalInOut
                                        </option>
                                        <option value={6}>
                                            ExponentialInOut
                                        </option>
                                        <option value={7}>CircularInOut</option>
                                    </select>
                                    <input
                                        type="range"
                                        step="5"
                                        min="20"
                                        max="200"
                                        value={time1}
                                        onChange={(e) =>
                                            setTime1(parseInt(e.target.value))
                                        }
                                    />
                                    <input
                                        type="range"
                                        step="50"
                                        min="1000"
                                        max="10000"
                                        value={time2}
                                        onChange={(e) =>
                                            setTime2(parseInt(e.target.value))
                                        }
                                    />
                                </>
                            )}
                        </div>
                    )}

                    {selectedLedId === 7 && (
                        <div
                            className={styles.section}
                            style={{
                                backgroundColor: `rgb(${red}, ${green}, ${blue})`,
                                color: green > 200 ? "black" : "white",
                            }}
                        >
                            <div className={styles.header}>
                                <label>
                                    RGB: ({red}, {green}, {blue})
                                </label>
                                <button
                                    className={styles.expandButton}
                                    onClick={() => handleSectionClick("colors")}
                                >
                                    {eyeIcon}
                                </button>
                            </div>
                            {expandedSection === "colors" && (
                                <>
                                    <input
                                        type="range"
                                        step="5"
                                        min="0"
                                        max="255"
                                        value={red}
                                        onChange={(e) =>
                                            setRed(parseInt(e.target.value))
                                        }
                                    />
                                    <input
                                        type="range"
                                        step="5"
                                        min="0"
                                        max="255"
                                        value={green}
                                        onChange={(e) =>
                                            setGreen(parseInt(e.target.value))
                                        }
                                    />
                                    <input
                                        type="range"
                                        step="5"
                                        min="0"
                                        max="255"
                                        value={blue}
                                        onChange={(e) =>
                                            setBlue(parseInt(e.target.value))
                                        }
                                    />
                                </>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default LedParametersForm;
