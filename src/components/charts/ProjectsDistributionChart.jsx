import { useEffect, useState } from "react"

import { getProjectsPomodorosApi } from "../../services/api/PomodoroApiService";
import { Buttons } from "./Buttons";

import { Doughnut } from "react-chartjs-2";

import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
Chart.register(CategoryScale);

export const ProjectsDistributionChart = ({ includeCategories }) => {
    // console.log("hi", chartData);

    const [chartData, setChartData] = useState({})

    // // for first time load (not needed)
    // useEffect(
    //     () => retrieveProjectsPomodoros('daily', 0),
    //     []
    // )

    // to reload chart after data retrival
    useEffect(
        () => console.log('reload projects chart'),
        [chartData]
    )

    function retrieveProjectsPomodoros(limit, offset) {
        getProjectsPomodorosApi(limit, offset, includeCategories)
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
            .catch(response => console.log(response))
    }

    return (
        <div>
            <Buttons retrievePomodoros={retrieveProjectsPomodoros}></Buttons>
            <div className="chart-container">
                <Doughnut
                    data={
                        {
                            labels: chartData.labels,
                            // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
                            datasets: [
                                {
                                    label: 'Time in minutes',
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
                                text: `Project's Distribution Time (${chartData.label})`
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