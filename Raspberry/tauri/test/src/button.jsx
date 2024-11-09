// Button.jsx

import React, { useState } from "react";

const ToggleButton = ({ onClick }) => {
    const [isOn, setIsOn] = useState(false);

    const handleToggle = () => {
        const newState = !isOn;
        setIsOn(newState);


        if (onClick) {
            onClick(newState); 
        }

        console.log("Wysłano stan:", newState ? "ON" : "OFF");
    };

    return (
        <button
            onClick={handleToggle}
            style={{
                padding: "10px 20px",
                height: "10%",
                fontSize: "16px",
                color: "#fff",
                backgroundColor: isOn ? "#4CAF50" : "#f44336", 
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                transition: "background-color 0.3s ease",
            }}
        >
            {isOn ? "ON" : "OFF"}
        </button>
    );
};

export default ToggleButton;
