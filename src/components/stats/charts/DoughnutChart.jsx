import { Buttons } from "components/stats/charts/Buttons";

import { Doughnut } from "react-chartjs-2";
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
Chart.register(CategoryScale);

export const DoughnutChart = ({
    chartData,
    retrievePomodoros,
    buttonsStates,
    setButtonsStates,
    showLoader,
    thickness,
    isDummy
}) => {

    return (
        <div>
            <h6>
                {chartData.label}<wbr />
                <span className="loader-container-2" >
                    <span className="ms-1 loader-2" style={{ display: showLoader ? "inline" : "none" }}></span>
                </span>
            </h6>

            <Buttons
                retrievePomodoros={retrievePomodoros}
                buttonsStates={buttonsStates}
                setButtonsStates={setButtonsStates}
                isDummy={isDummy}
            />

            <div className="chart-container">
                <Doughnut
                    data={
                        {
                            labels: chartData.labels,
                            // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
                            datasets: [
                                {
                                    data: chartData.data,
                                    // you can set indiviual colors for each bar
                                    backgroundColor: chartData.colors,
                                }
                            ]
                        }

                    }
                    options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        aspectRatio: 0.75,
                        cutout: 25 * (4 - thickness),
                        plugins: {
                            legend: {
                                display: true,
                                position: 'top',
                                labels: {
                                    boxWidth: 10
                                }
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
};