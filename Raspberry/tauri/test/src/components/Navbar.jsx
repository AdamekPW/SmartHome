import React from "react";
import styles from "../styles/components/Navbar.module.scss";

import { FaFan } from "react-icons/fa";
import { RiOutletLine } from "react-icons/ri";
import { TbCircuitDiode } from "react-icons/tb";

const Navbar = ({ selectedModule, onModuleSelect }) => {
    return (
        <div className={styles.container}>
            <button
                className={`${styles.logoButton} ${
                    selectedModule === "home" ? styles.active : ""
                }`}
                onClick={() => onModuleSelect("home")}
            >
                Logo
            </button>
            <p className={styles.modulesTitle}>Moduły</p>
            <button
                className={`${styles.moduleButton} ${
                    selectedModule === "fan" ? styles.active : ""
                }`}
                onClick={() => onModuleSelect("fan")}
            >
                <FaFan />
            </button>
            <button
                className={`${styles.moduleButton} ${
                    selectedModule === "plugstrip" ? styles.active : ""
                }`}
                onClick={() => onModuleSelect("plugstrip")}
            >
                <RiOutletLine />
            </button>
            <button
                className={`${styles.moduleButton} ${
                    selectedModule === "ledstrip" ? styles.active : ""
                }`}
                onClick={() => onModuleSelect("ledstrip")}
            >
                <TbCircuitDiode />
            </button>
        </div>
    );
};

export default Navbar;
