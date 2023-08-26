import { Buttons } from "components/stats/charts/Buttons";

import { Bar } from "react-chartjs-2";
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
import { useEffect, useRef } from "react";
Chart.register(CategoryScale);

export const BarChart = ({
    chartData,
    retrievePomodoros,
    buttonsStates,
    setButtonsStates
}) => {
    const progress = useRef(null);

    useEffect(() => {
        console.log(progress)
        // const progress = document.getElementById('animationProgress');
        // console.log(progress);
    }, [])

    return (
        <div>
            <Buttons
                retrievePomodoros={retrievePomodoros}
                buttonsStates={buttonsStates}
                setButtonsStates={setButtonsStates}
            />

            <div className="chart-container">
                <div>
                    <progress id="animationProgress" ref={progress} max={1} value={null} style={{ width: '100%' }}></progress>
                </div>
                <Bar
                    data={
                        {
                            labels: chartData.labels,
                            // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
                            datasets: [
                                {
                                    data: chartData.data,
                                    // you can set indiviual colors for each bar
                                    backgroundColor: chartData.colors,
                                    borderWidth: 1,
                                    barThickness: 6,  // number (pixels) or 'flex'
                                    maxBarThickness: 8 // number (pixels)
                                }
                            ]
                        }

                    }
                    options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        aspectRatio: 1,
                        plugins: {
                            title: {
                                display: true,
                                text: chartData.label
                            },
                            legend: {
                                display: false
                            }
                        },
                        animation: {
                            onProgress: function (animation) {
                                progress.current.value = animation.currentStep / animation.numSteps;
                            }
                        },
                        afterDraw: function (chart) {
                            console.log(chart);
                            if (chart.data.datasets[0].data.length < 1) {
                                let ctx = chart.ctx;
                                let width = chart.width;
                                let height = chart.height;
                                ctx.textAlign = "center";
                                ctx.textBaseline = "middle";
                                ctx.font = "30px Arial";
                                ctx.fillText("No data to display", width / 2, height / 2);
                                ctx.restore();
                            }
                        },
                    }}
                />
            </div>
        </div>
    );
};