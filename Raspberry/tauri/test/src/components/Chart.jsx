import React, { useMemo } from "react";
import { useState } from "react";
import { ResponsiveLine } from "@nivo/line";
import { ResponsiveBar } from "@nivo/bar";

import styles from "../styles/components/Chart.module.scss";

const calculateAverage = (data) => {
    const filteredData = data.filter(value => value !== 0);
    if (filteredData.length === 0) return 0;
    const sum = filteredData.reduce((acc, value) => acc + parseFloat(value, 10), 0);
    return (sum / filteredData.length).toFixed(2);
};

const Chart = ({ type, data = [], dbData = []}) => {
    const [showingSessionData, setShowingSessionData] = useState(true);

    const handleRadioChange = (e) => {
        if (e.target.value === "historical" && dbData.length === 0) {
            console.log("brak danych do wyswietlenia");
            return;
        }
        setShowingSessionData(e.target.value === "session");
    };

    const chartData = useMemo(() => {
        return (showingSessionData ? data : dbData).map((value, index) => ({
            x: index + 1,
            y: value,
        }));
    }, [showingSessionData, data, dbData]);

    const barData = useMemo(() => {
        return dbData.map((value, index) => ({
            index: `${index + 1}`,
            value,
        }));
    }, [dbData]);

    const chartLabel =
        type === "temperature" ? "Temperatura (°C)" : "Zużycie prądu (W)";

    const average = useMemo(() => {
        return showingSessionData ? calculateAverage(data) : calculateAverage(dbData);
    }, [showingSessionData, data, dbData]);

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
            <div className={styles.average}>
                Średnia: {average} {type === "temperature" ? "°C" : "W"}
            </div>
            {showingSessionData ? (
                <ResponsiveLine
                    data={[
                        {
                            id: type,
                            data: chartData,
                        },
                    ]}
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
            ) : (
                <ResponsiveBar
                    data={barData}
                    keys={["value"]}
                    indexBy="index"
                    margin={{ top: 20, right: 30, bottom: 50, left: 50 }}
                    padding={0.3}
                    colors={{ scheme: "set3" }}
                    labelTextColor="transparent"
                    axisLeft={{
                        legend: chartLabel,
                        legendOffset: -40,
                        legendPosition: "middle",
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 0,
                    }}
                    axisBottom={{
                        legend: "Dzień",
                        legendOffset: 36,
                        legendPosition: "middle",
                        tickSize: 5,
                        tickPadding: 5,
                        tickRotation: 90,

                    }}
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
            )}
        </div>
    );
};

export default Chart;
