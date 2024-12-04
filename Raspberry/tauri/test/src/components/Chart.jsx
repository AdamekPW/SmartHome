import React from "react";
import { useState } from "react";
import { ResponsiveLine } from "@nivo/line";

import styles from "../styles/components/Chart.module.scss";

const Chart = ({ type, data, dbData }) => {
    const [showingSessionData, setShowingSessionData] = useState(true);

    const handleRadioChange = (e) => {
        if (e.target.value === "historical" && dbData.length === 0) {
            console.log("brak danych do wyswietlenia")
            return;
        }
        setShowingSessionData(e.target.value === "session");
    };

    const chartData = [
        {
            id: type,
            data: (showingSessionData ? data : dbData).map((value, index) => ({
                x: index,
                y: value,
            })),
        },
    ];

    const chartLabel =
        type === "temperature" ? "Temperatura (°C)" : "Zużycie prądu (kWh)";

    return (
        <div className={styles.container}>
            <div className={styles.labels}>
                <label>
                    <input
                        type="radio"
                        name="dataType"
                        value="session"
                        checked={showingSessionData}
                        onChange={handleRadioChange}
                    />
                    <span></span>
                    Dane z obecnej sesji
                </label>
                <label>
                    <input
                        type="radio"
                        name="dataType"
                        value="historical"
                        checked={!showingSessionData}
                        onChange={handleRadioChange}
                    />
                    <span></span>
                    Dane historyczne
                </label>
            </div>
            <ResponsiveLine
                data={chartData}
                margin={{ top: 20, right: 30, bottom: 50, left: 50 }}
                xScale={{ type: "linear" }}
                yScale={{ type: "linear" }}
                axisLeft={{
                    legend: chartLabel,
                    legendOffset: -40,
                    legendPosition: "middle",
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                }}
                axisBottom={{
                    legend: "Odczyt",
                    legendOffset: 36,
                    legendPosition: "middle",
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                }}
                colors={{ scheme: "set3" }}
                lineWidth={2}
                pointSize={4}
                pointColor={{ theme: "background" }}
                enableArea={true}
                areaOpacity={0.2}
                useMesh={true}
                theme={{
                    axis: {
                        ticks: {
                            text: {
                                fill: "#ddd",
                            },
                        },
                        legend: {
                            text: {
                                fill: "#ddd",
                            },
                        },
                    },
                    grid: {
                        line: {
                            stroke: "#555",
                            strokeWidth: 0.5,
                        },
                    },
                }}
            />
        </div>
    );
};

export default Chart;
