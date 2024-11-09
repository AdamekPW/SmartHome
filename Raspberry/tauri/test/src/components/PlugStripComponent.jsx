import styles from "../styles/components/PlugStripComponent.module.scss";
import { GiPlainCircle } from "react-icons/gi";

const PlugStripComponent = () => {
    return (
        <div className={styles.PlugContent}>
            <div className={styles.PlugChart}>
                
            </div>
            <div className={styles.Plug}>
                <div className={styles.CircleOn}>
                    <GiPlainCircle className={styles.Dot} />
                    <GiPlainCircle className={styles.Dot} />
                </div>
                <div className={styles.CircleOff}>
                    <GiPlainCircle className={styles.Dot} />
                    <GiPlainCircle className={styles.Dot} />
                </div>
            </div>
        </div>
    );
};

export default PlugStripComponent;
