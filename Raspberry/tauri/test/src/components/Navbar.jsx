import React from "react";
import styles from "../styles/components/Navbar.module.scss";

import { FaFan } from "react-icons/fa";
import { RiOutletLine } from "react-icons/ri";
import { TbCircuitDiode } from "react-icons/tb";

const Navbar = () => {
    return (
        <div className={styles.container}>
            <button className={styles.logoButton}>Logo</button>
            <p className={styles.modulesTitle}>Moduły</p>
            <button className={styles.moduleButton}>
                <FaFan />
            </button>
            <button className={styles.moduleButton}>
                <RiOutletLine />
            </button>
            <button className={styles.moduleButton}>
                <TbCircuitDiode />
            </button>
        </div>
    );
};

export default Navbar;
