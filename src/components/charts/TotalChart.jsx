import { useState } from "react"
import moment from "moment"

import { getTotalPomodorosApi } from "../../services/api/PomodoroApiService"
import { Buttons } from "./Buttons";

import { Bar } from "react-chartjs-2"

import { CategoryScale } from 'chart.js'
import Chart from 'chart.js/auto'
import annotationPlugin from "chartjs-plugin-annotation";
Chart.register(CategoryScale)
Chart.register(annotationPlugin);

const DAILY_GOAL = 16;
const DAILY_THRESHOLD = 14;
const POMODORO_LENGTH = 25;

export const TotalChart = ({ includeCategories, buttonsStates, setButtonsStates }) => {
    const [datasets, setDatasets] = useState([])

    const [labels, setLabels] = useState([])

    // // for first time load (not needed)
    // useEffect(
    //     () => {
    //         retrieveTotalPomodoros('daily', 0)
    //         updateLabels('daily', 0)
    //     },
    //     []
    // )

    // not needed
    // // for reload data retrival
    // useEffect(
    //     () => console.log('reload total chart'),
    //     [datasets]
    // )

    function retrieveTotalPomodoros(limit, offset) {
        updateLabels(limit, offset)
        getTotalPomodorosApi(limit, offset, includeCategories)
            .then(response => {
                // console.log("stacked", response)
                const temp_datasets = [];
                temp_datasets.label = limit;
                if (limit === 'daily') {
                    temp_datasets.goal = POMODORO_LENGTH * DAILY_GOAL;
                    temp_datasets.threshold = POMODORO_LENGTH * DAILY_THRESHOLD;
                } else if (limit === 'weekly') {
                    temp_datasets.goal = 5 * POMODORO_LENGTH * DAILY_GOAL;
                    temp_datasets.threshold = 5 * POMODORO_LENGTH * DAILY_THRESHOLD;
                } else if (limit === 'monthly') {
                    temp_datasets.goal = 22 * POMODORO_LENGTH * DAILY_GOAL;
                    temp_datasets.threshold = 22 * POMODORO_LENGTH * DAILY_THRESHOLD;
                }

                for (const key in response.data) {
                    const dataset = {
                        label: key,
                        backgroundColor: response.data[key][0][3],
                        data: new Array(15).fill(0)
                    }
                    if (limit === 'daily') {
                        for (const val of response.data[key]) {
                            // console.log(val[0], moment().add(-val[0] + 1, 'd').format('DD'));
                            // todo: find cleaner solution for mapping data to labels
                            dataset.data[15 - moment().add(-val[0] + 1, 'd').add(15 * offset, 'd').format('DD')] = val[1];
                        }
                    } else if (limit === 'weekly') {
                        for (const val of response.data[key]) {
                            // console.log(val[0], val[1], moment().format('W'));
                            dataset.data[15 - moment().add(-val[0] + 1, 'W').add(15 * offset, 'W').format('W')] = val[1];
                        }
                    } else if (limit === 'monthly') {
                        for (const val of response.data[key]) {
                            // console.log(val[0], val[1], moment().format('W'));
                            dataset.data[15 - (moment().add(-val[0] + 1, 'M').add(15 * offset, 'M').format('M'))] = val[1];
                        }
                    }
                    // console.log(dataset);
                    temp_datasets.push(dataset);
                }
                // console.log(temp_datasets)
                setDatasets(temp_datasets);
                // setDatasets(structuredClone(datasets))
            })
            .catch(error => console.error(error.message))
    }

    function updateLabels(limit, offset) {
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
                            annotation: {
                                annotations: {
                                    line1: {
                                        type: 'line',
                                        yMin: datasets.goal,
                                        yMax: datasets.goal,
                                        borderColor: 'green',
                                        borderWidth: 1,
                                        borderDash: [1, 1],
                                        label: {
                                            content: 'goal',
                                            display: true,
                                            backgroundColor: 'white',
                                            color: 'gray'
                                        }
                                    },
                                    line2: {
                                        type: 'line',
                                        yMin: datasets.threshold,
                                        yMax: datasets.threshold,
                                        borderColor: 'red',
                                        borderWidth: 1,
                                        borderDash: [1, 1],
                                        label: {
                                            content: '',
                                            display: true,
                                            backgroundColor: 'white',
                                            color: 'gray'
                                        }
                                    }
                                }
                            }
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