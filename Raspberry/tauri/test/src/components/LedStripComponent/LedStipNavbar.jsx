import styles from "../../styles/components/LedStripComponent/LedStripNavbar.module.scss";

import { ledOptions } from "./ledOptions";

const LedStripNavbar = () => {
    const displayLedOptions = () => {
        return ledOptions.map((option) => {
            return (
                <div className={styles.optionWithLine}>
                    <hr className={styles.line}></hr>
                    <div className={styles.ledOptionElement}>
                        <p className={styles.ledOption}>{option.name}</p>
                    </div>
                </div>
            );
        });
    };
    return (
        <div className={styles.container}>
            <p>Pokaż wykres</p>
            {displayLedOptions()}
        </div>
    );
};

export default LedStripNavbar;
