import { useState } from "react"

import { getTasksPomodorosApi } from "services/api/PomodoroApiService";
import { calculateScaleAndLabel, calculateScaleForAdjustedAvg, truncateString } from "services/helpers/chartHelper";

import { Buttons } from "components/stats/charts/Buttons";

import { Doughnut } from "react-chartjs-2";
import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
Chart.register(CategoryScale);

export const TasksChart = ({ includeCategories, statsSettings, buttonsStates, setButtonsStates }) => {
    // console.debug('from TasksChart', includeCategories, statsSettings)

    const [chartData, setChartData] = useState({ label: '' })

    // // for first time load (not needed)
    // useEffect(
    //     () => retrieveTasksPomodoros('daily', 0),
    //     []
    // )

    // // not needed
    // // for reload data retrival
    // useEffect(
    //     () => console.debug('reload tasks chart'),
    //     [chartData]
    // )

    function retrieveTasksPomodoros({ startDate, endDate, limit, offset }) {
        // console.debug(startDate, endDate)
        // console.debug("t", includeCategories)

        let { scale, label } = calculateScaleAndLabel({ limit, ...statsSettings });

        if (offset === 0) {
            scale = calculateScaleForAdjustedAvg({ limit, scale, ...statsSettings });
        }

        getTasksPomodorosApi({ startDate, endDate, includeCategories })
            .then(response => {
                // console.debug(response)
                const updated_data = {
                    labels: [],
                    data: [],
                    colors: [],
                    label: `Task's Distribution Time (${label})`
                }
                response.data.forEach(element => {
                    // console.debug(element);
                    updated_data.colors.push(element[2]);
                    updated_data.labels.push(truncateString(element[1], 30));
                    updated_data.data.push(element[0] / scale);
                });
                // console.debug(updated_data);
                setChartData(updated_data)
                // console.debug("retrieved updated data: ", chartData);
            })
            .catch(error => console.error(error.message))
    }

    return (
        <div>
            <Buttons
                retrievePomodoros={retrieveTasksPomodoros}
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
                                    // borderWidth: 1,
                                    // barThickness: 6,  // number (pixels) or 'flex'
                                    // maxBarThickness: 8 // number (pixels)
                                }
                            ]
                        }

                    }
                    options={{
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: chartData.label
                            },
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