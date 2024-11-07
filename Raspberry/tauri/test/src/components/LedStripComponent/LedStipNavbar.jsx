import styles from "../../styles/components/LedStripComponent/LedStripNavbar.module.scss";

import { ledOptions } from "./ledOptions";

const LedStripNavbar = () => {
    const displayLedOptions = () => {
        return ledOptions.map((option) => {
            return (
                <div>
                    <hr className={styles.line}></hr>
                    <p className={styles.ledOption}>{option.name}</p>
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
