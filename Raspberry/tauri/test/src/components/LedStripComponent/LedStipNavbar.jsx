import styles from "../../styles/components/LedStripComponent/LedStripNavbar.module.scss";

import { ledOptions } from "./ledOptions";

const LedStripNavbar = ({ selectedLedId, onSelectLedId }) => {
    const displayLedOptions = () => {
        return ledOptions.map((option) => {
            return (
                <div className={styles.optionWithLine} key={option.id}>
                    {option.id === 0 ? (
                        <></>
                    ) : (
                        <hr className={styles.line}></hr>
                    )}
                    <div
                        className={`${styles.ledOptionElement} ${
                            selectedLedId === option.id ? styles.active : ""
                        }`}
                    >
                        <p
                            className={styles.ledOption}
                            onClick={() => onSelectLedId(option.id)}
                        >
                            {option.name}
                        </p>
                    </div>
                </div>
            );
        });
    };
    return (
        <div className={styles.container}>
            {/* <p>Pokaż wykres</p> */}
            {displayLedOptions()}
        </div>
    );
};

export default LedStripNavbar;
