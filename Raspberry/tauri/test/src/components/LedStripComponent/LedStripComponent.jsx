import styles from "../../styles/components/LedStripComponent/LedStripComponent.module.scss";

import LedStripNavbar from "./LedStipNavbar";

const LedStripComponent = () => {
    return (
        <div className={styles.container}>
            <LedStripNavbar />
            <div>
                <p>Coś</p>
            </div>
        </div>
    );
};

export default LedStripComponent;
