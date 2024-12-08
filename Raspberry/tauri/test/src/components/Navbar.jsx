import React from "react";
import styles from "../styles/components/Navbar.module.scss";

import { FaFan } from "react-icons/fa";
import { RiOutletLine } from "react-icons/ri";

const Navbar = ({ selectedModule, onModuleSelect }) => {
    return (
        <div className={styles.container}>
            <button
                className={`${styles.logoButton} ${
                    selectedModule === "home" ? styles.active : ""
                }`}
                onClick={() => onModuleSelect("home")}
            >
                <img className={styles.logo} src="/logo.png" alt="logo"></img>
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
                <img src="led-strip.png" className={styles.icon}></img>
            </button>
        </div>
    );
};

export default Navbar;
