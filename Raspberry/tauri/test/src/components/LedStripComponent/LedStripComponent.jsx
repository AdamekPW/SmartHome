import { useState } from "react";

import styles from "../../styles/components/LedStripComponent/LedStripComponent.module.scss";

import LedStripNavbar from "./LedStipNavbar";

const LedStripComponent = () => {
    const [selectedLedId, setSelectedLedId] = useState(1); // id: 1, mode name: rainbow

    return (
        <div className={styles.container}>
            <LedStripNavbar
                selectedLedId={selectedLedId}
                onSelectLedId={setSelectedLedId}
            />
            <div>
                <p>{selectedLedId}</p>
            </div>
        </div>
    );
};

export default LedStripComponent;
