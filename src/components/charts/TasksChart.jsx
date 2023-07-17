import { useState } from "react"

import { getTasksPomodorosApi } from "../../services/api/PomodoroApiService";
import { Buttons } from "./Buttons";

import { Bar } from "react-chartjs-2";

import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
Chart.register(CategoryScale);

export const TasksChart = ({ includeCategories, buttonsStates, setButtonsStates }) => {
    // console.log("hi", chartData);
    // console.log(includeCategories)

    const [chartData, setChartData] = useState({})

    // // for first time load (not needed)
    // useEffect(
    //     () => retrieveTasksPomodoros('daily', 0),
    //     []
    // )

    // // not needed
    // // for reload data retrival
    // useEffect(
    //     () => console.log('reload tasks chart'),
    //     [chartData]
    // )

    function retrieveTasksPomodoros(limit, offset) {
        // console.log(limit, offset)
        // console.log(includeCategories)
        getTasksPomodorosApi(limit, offset, includeCategories)
            .then(response => {
                // console.log(response)
                const updated_data = {
                    labels: [],
                    data: [],
                    colors: [],
                    label: limit
                }
                response.data.forEach(element => {
                    // console.log(element);
                    updated_data.colors.push(element[2]);
                    updated_data.labels.push(element[1]);
                    updated_data.data.push(element[0]);
                });
                // console.log(updated_data);
                setChartData(updated_data)
                // console.log("retrieved updated data: ", chartData);
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
                <Bar
                    data={
                        {
                            labels: chartData.labels,
                            // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
                            datasets: [
                                {
                                    label: 'time in minutes',
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
                                text: `Task's Distribution Time (${chartData.label})`
                            },
                            legend: {
                                display: false
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
};