import { useState } from "react";
import styles from "../styles/components/PlugStripComponent.module.scss";
import { GiPlainCircle } from "react-icons/gi";

const PlugStripComponent = () => {

    const [isOn1, setIsOn1] = useState(false);
    const [isOn2, setIsOn2] = useState(false);

    const toggleCircle1 = () => {
        setIsOn1(prevIsOn => !prevIsOn);
    };

    const toggleCircle2 = () => {
        setIsOn2(prevIsOn => !prevIsOn);
    };

    return (
        <div className={styles.PlugContent}>
            <div className={styles.PlugChart}>
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
