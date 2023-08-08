import { useState } from "react"

import { getProjectsPomodorosApi } from "../../services/api/PomodoroApiService";
import { Buttons } from "./Buttons";
import { useAuth } from "../../services/auth/AuthContext";
import { calculateScaleAndLabel } from "../../services/helpers/chartHelper";

import { Doughnut } from "react-chartjs-2";

import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
Chart.register(CategoryScale);

export const ProjectsDistributionChart = ({ includeCategories, buttonsStates, setButtonsStates }) => {
    // console.debug("hi", chartData);

    const authContext = useAuth()
    const userSettings = authContext.userSettings

    const [chartData, setChartData] = useState({})

    // // for first time load (not needed)
    // useEffect(
    //     () => retrieveProjectsPomodoros('daily', 0),
    //     []
    // )

    // // not needed
    // // to reload chart after data retrival
    // useEffect(
    //     () => console.debug('reload projects chart'),
    //     [chartData]
    // )

    function retrieveProjectsPomodoros({ startDate, endDate, limit }) {
        // calculate scale and label according to user settings
        const { scale, label } = calculateScaleAndLabel({ limit, userSettings });

        // console.debug("p", includeCategories)
        getProjectsPomodorosApi({ startDate, endDate, includeCategories })
            .then(response => {
                // console.debug(response)
                const updated_data = {
                    labels: [],
                    data: [],
                    colors: [],
                    label: label
                }
                response.data.forEach(element => {
                    // console.debug(element);
                    updated_data.colors.push(element[2]);
                    updated_data.labels.push(element[1]);
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
                retrievePomodoros={retrieveProjectsPomodoros}
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