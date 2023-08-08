import { useState } from "react"
import moment from "moment"

import { useAuth } from "../../services/auth/AuthContext";
import { getTotalPomodorosApi } from "../../services/api/PomodoroApiService"
import { Buttons } from "./Buttons";

import { Bar } from "react-chartjs-2"

import { CategoryScale } from 'chart.js'
import Chart from 'chart.js/auto'
import annotationPlugin from "chartjs-plugin-annotation";
import { calculateScaleAndLabel } from "../../services/helpers/chartHelper";
Chart.register(CategoryScale)
Chart.register(annotationPlugin);

const DAILY_GOAL = 16;
const DAILY_THRESHOLD = 14;
const POMODORO_LENGTH = 25;
const WEEKLY_DAYS = 7;
const MONTHLY_AVG = 22;

export const TotalChart = ({ includeCategories, buttonsStates, setButtonsStates }) => {
    const authContext = useAuth()
    const userSettings = authContext.userSettings

    const [datasets, setDatasets] = useState([])

    const [labels, setLabels] = useState([])

    function retrieveTotalPomodoros({ limit, offset }) {
        // console.debug({ limit, offset });
        // console.debug("total", includeCategories)

        // calculate scale and label according to user settings
        const { scale, label } = calculateScaleAndLabel({ limit, userSettings });

        const localDatasets = [];
        localDatasets.label = label;

        updateLabels({ limit, offset })
        updateGoals({ limit, localDatasets })

        const { startDate, endDate } = calculateDates({ limit, offset });

        getTotalPomodorosApi({ limit, startDate, endDate, includeCategories })
            .then(response => {
                // console.debug("stacked", response)

                for (const key in response.data) {
                    const dataset = {
                        label: key,
                        backgroundColor: response.data[key][0][3],
                        data: new Array(15).fill(0)
                    }
                    if (limit === 'daily') {
                        for (const val of response.data[key]) {
                            // console.debug(val[0], moment().add(-val[0] + 1, 'd').format('DD'));
                            // todo: find cleaner solution for mapping data to labels
                            const date_index = 15 - moment().add(-val[0] + 1, 'd').add(15 * offset, 'd').format('DD');
                            dataset.data[date_index] = val[1] / scale;
                        }
                    } else if (limit === 'weekly') {
                        for (const val of response.data[key]) {
                            // console.debug(val, val[1], moment().format('W'));
                            const date_index = 15 - moment().add(-val[0] + 1, 'W').add(15 * offset, 'W').format('W');
                            dataset.data[date_index] = val[1] / scale;
                        }
                    } else if (limit === 'monthly') {
                        for (const val of response.data[key]) {
                            const date = moment().add(-val[0] + 1, 'M').add(15 * offset, 'M');
                            const date_index = 15 - (date.format('M'));
                            dataset.data[date_index] = val[1] / scale;
                        }
                    }
                    // console.debug(dataset);
                    localDatasets.push(dataset);
                }
                // console.debug(localDatasets)
                setDatasets(localDatasets);
                // setDatasets(structuredClone(datasets))
            })
            .catch(error => console.error(error.message))
    }

    function calculateDates({ limit, offset }) {
        let startDate, endDate;

        if (limit === 'daily') {
            const date = moment().startOf('day').add(-14, 'd').add(15 * offset, 'd');
            startDate = date.toISOString();
            endDate = date.clone().add(15, 'd').toISOString();
            // console.debug(startDate, endDate);
        } else if (limit === 'weekly') {
            const date = moment().startOf('week').add(1, 'd').add(-14 + 15 * offset, 'w');
            startDate = date.toISOString();
            endDate = date.clone().endOf('week').add(14, 'w').add(1, 'd').toISOString();
            // console.debug(startDate, endDate);
        } else if (limit === 'monthly') {
            const date = moment().startOf('month').add(-14 + 15 * offset, 'M');
            startDate = date.toISOString();
            endDate = date.clone().endOf('month').add(14, 'M').toISOString();
            // console.debug(startDate, endDate);
        }

        return { startDate, endDate }
    }

    function updateGoals({ limit, localDatasets }) {
        if (limit === 'daily') {
            localDatasets.goal = POMODORO_LENGTH * DAILY_GOAL;
            localDatasets.threshold = POMODORO_LENGTH * DAILY_THRESHOLD;
        } else if (limit === 'weekly') {
            localDatasets.goal = WEEKLY_DAYS * POMODORO_LENGTH * DAILY_GOAL;
            localDatasets.threshold = WEEKLY_DAYS * POMODORO_LENGTH * DAILY_THRESHOLD;
        } else if (limit === 'monthly') {
            localDatasets.goal = MONTHLY_AVG * POMODORO_LENGTH * DAILY_GOAL;
            localDatasets.threshold = MONTHLY_AVG * POMODORO_LENGTH * DAILY_THRESHOLD;
        }
    }

    function updateLabels({ limit, offset }) {
        const labels = [];
        if (limit === 'daily') {
            for (let i = 0; i < 15; i++) {
                const str = moment()
                    .add(15 * offset, 'd')
                    .add(-14 + i, 'd')
                    .format('DD MMM')
                labels.push(str)
            }
        } else if (limit === 'weekly') {
            const dow = moment().format('e');   // day of week
            for (let i = 0; i < 15; i++) {
                const str = moment()
                    .add(-dow + 1, 'd')
                    .add(15 * offset, 'w')
                    .add(i - 14, 'w')
                    .format('DD MMM')
                    + "-" + moment()
                        .add(-dow, 'd')
                        .add(15 * offset, 'w')
                        .add(i + 1 - 14, 'w')
                        .format('DD MMM')
                labels.push(str);
            }
        } else if (limit === 'monthly') {
            for (let i = 0; i < 15; i++) {
                const str = moment()
                    .add(15 * offset, 'M')
                    .add(i - 14, 'M')
                    .format('MMM YY')
                labels.push(str);
            }
        }

        setLabels(labels);
    }

    return (
        <div>
            <Buttons
                retrievePomodoros={retrieveTotalPomodoros}
                buttonsStates={buttonsStates}
                setButtonsStates={setButtonsStates}
                showDateString={false}
            />

            <div className="chart-container">
                <Bar
                    data={
                        {
                            labels: labels,
                            // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
                            datasets: datasets
                        }

                    }
                    options={{
                        responsive: true,
                        maintainAspectRatio: true,
                        aspectRatio: 0.75,
                        plugins: {
                            title: {
                                display: true,
                                text: `Total Distribution Time (${datasets.label})`
                            },
                            legend: {
                                display: true,
                                position: 'top',
                                labels: {
                                    boxWidth: 10
                                }
                            },
                            // annotation: {
                            //     annotations: {
                            //         line1: {
                            //             type: 'line',
                            //             yMin: datasets.goal,
                            //             yMax: datasets.goal,
                            //             borderColor: 'green',
                            //             borderWidth: 1,
                            //             borderDash: [1, 1],
                            //             label: {
                            //                 content: 'goal',
                            //                 display: true,
                            //                 backgroundColor: 'white',
                            //                 color: 'gray'
                            //             }
                            //         },
                            //         line2: {
                            //             type: 'line',
                            //             yMin: datasets.threshold,
                            //             yMax: datasets.threshold,
                            //             borderColor: 'red',
                            //             borderWidth: 1,
                            //             borderDash: [1, 1],
                            //             label: {
                            //                 content: '',
                            //                 display: true,
                            //                 backgroundColor: 'white',
                            //                 color: 'gray'
                            //             }
                            //         }
                            //     }
                            // }
                        },
                        scales: {
                            x: {
                                stacked: true
                            },
                            y: {
                                stacked: true
                            }
                        }
                    }}
                />
            </div>
        </div>
    );
};