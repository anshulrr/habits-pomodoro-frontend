import { Buttons } from "components/stats/charts/Buttons";

import { Doughnut } from "react-chartjs-2";
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
Chart.register(CategoryScale);

export const DoughnutChart = ({
    chartData,
    retrievePomodoros,
    buttonsStates,
    setButtonsStates
}) => {

    return (
        <div>
            <h6>
                {chartData.label}<wbr />
            </h6>

            <Buttons
                retrievePomodoros={retrievePomodoros}
                buttonsStates={buttonsStates}
                setButtonsStates={setButtonsStates}
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
                        plugins: {
                            legend: {
                                display: true,
                                position: 'right',
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