import { useState } from "react"
import moment from "moment"

import { getTotalPomodorosApi } from "services/api/PomodoroApiService"
import { calculateScaleAndLabel, calculateScaleForAdjustedAvg } from "services/helpers/chartHelper";

import { Buttons } from "components/stats/charts/Buttons";

import { Bar } from "react-chartjs-2"
import { CategoryScale } from 'chart.js'
import Chart from 'chart.js/auto'
import annotationPlugin from "chartjs-plugin-annotation";
Chart.register(CategoryScale)
Chart.register(annotationPlugin);

const X_COUNT = 12;
const DAILY_GOAL = 16;
const DAILY_THRESHOLD = 14;
const POMODORO_LENGTH = 25;
const WEEKLY_DAYS = 7;
const MONTHLY_AVG = 22;

export const TotalChart = ({ includeCategories, subject, statsSettings, buttonsStates, setButtonsStates }) => {

    const [datasets, setDatasets] = useState([])

    const [chartLabel, setChartLabel] = useState('')

    const [labels, setLabels] = useState([])

    const [showLoader, setShowLoader] = useState(false);

    function retrieveTotalPomodoros({ limit, offset }) {
        setShowLoader(true);
        // console.debug({ limit, offset });
        // console.debug("total", includeCategories)

        // calculate scale and label according to user settings
        const { scale, label } = calculateScaleAndLabel({ limit, ...statsSettings });

        const localDatasets = [];

        updateLabels({ limit, offset })
        updateGoals({ limit, localDatasets })

        const { startDate, endDate } = calculateDates({ limit, offset });
        // console.debug({ limit, offset, startDate, endDate })

        getTotalPomodorosApi({ limit, startDate, endDate, includeCategories, subject })
            .then(response => {
                // console.debug("stacked", response.data)

                // set label after chart data is received
                setChartLabel(`Total (${label})`);

                for (const key in response.data) {
                    const dataset = {
                        label: key,
                        backgroundColor: response.data[key].color,
                        data: new Array(X_COUNT).fill(0),
                        level: response.data[key].level, // for sort order
                        priority: response.data[key].priority, // for sort order
                        maxBarThickness: 6 * 3,
                    }
                    if (limit === 'daily') {
                        for (const val of response.data[key].dataArr) {
                            // console.debug(val.index, moment().add(-val.index + 1, 'd').format('DD'));
                            // todo: find cleaner solution for mapping data to labels
                            const date_index = X_COUNT - moment().add(-val.index + 1, 'd').add(X_COUNT * offset, 'd').format('DD');
                            dataset.data[date_index] = val.timeElapsed / scale;
                        }
                    } else if (limit === 'weekly') {
                        for (const val of response.data[key].dataArr) {
                            // console.debug(val, val.timeElapsed, moment().format('W'));
                            const date_index = X_COUNT - moment().add(-val.index + 1, 'W').add(X_COUNT * offset, 'W').format('W');

                            let adjusted_scale = scale;
                            if (offset === 0 && date_index === (X_COUNT - 1)) {
                                adjusted_scale = calculateScaleForAdjustedAvg({ limit, scale, ...statsSettings });
                            }
                            dataset.data[date_index] = val.timeElapsed / adjusted_scale;
                        }
                    } else if (limit === 'monthly') {
                        for (const val of response.data[key].dataArr) {
                            const date = moment().add(-val.index + 1, 'M').add(X_COUNT * offset, 'M');
                            const date_index = X_COUNT - (date.format('M'));

                            let adjusted_scale = scale;
                            if (offset === 0 && date_index === (X_COUNT - 1)) {
                                adjusted_scale = calculateScaleForAdjustedAvg({ limit, scale, ...statsSettings });
                            }
                            dataset.data[date_index] = val.timeElapsed / adjusted_scale;
                        }
                    }
                    // console.debug(dataset);
                    localDatasets.push(dataset);
                }
                localDatasets.sort((a, b) => +a.priority - +b.priority);
                localDatasets.sort((a, b) => +a.level - +b.level);
                // console.debug(localDatasets)
                setDatasets(localDatasets);
                // setDatasets(structuredClone(datasets))
                setShowLoader(false);
            })
            .catch(error => console.error(error.message))
    }

    function calculateDates({ limit, offset }) {
        let startDate, endDate;

        if (limit === 'daily') {
            const date = moment().startOf('day').add(-(X_COUNT - 1) + X_COUNT * offset, 'd');
            startDate = date.toISOString();
            endDate = date.clone().endOf('day').add((X_COUNT - 1), 'd').toISOString();
            // console.debug(startDate, endDate);
        } else if (limit === 'weekly') {
            const date = moment().startOf('isoWeek').add(-(X_COUNT - 1) + X_COUNT * offset, 'w');
            startDate = date.toISOString();
            endDate = date.clone().endOf('isoWeek').add((X_COUNT - 1), 'w').toISOString();
            // console.debug(startDate, endDate);
        } else if (limit === 'monthly') {
            const date = moment().startOf('month').add(-(X_COUNT - 1) + X_COUNT * offset, 'M');
            startDate = date.toISOString();
            endDate = date.clone().add((X_COUNT - 1), 'M').endOf('month').toISOString();
            // note: end of the month should be calculated in the end: as it changes every month
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
            for (let i = 0; i < X_COUNT; i++) {
                const str = moment()
                    .add(X_COUNT * offset, 'd')
                    .add(-(X_COUNT - 1) + i, 'd')
                    .format('DD MMM')
                labels.push(str)
            }
        } else if (limit === 'weekly') {
            for (let i = 0; i < X_COUNT; i++) {
                const str = moment()
                    .startOf('isoWeek')
                    .add(X_COUNT * offset, 'w')
                    .add(i - (X_COUNT - 1), 'w')
                    .format('DD MMM')
                    + "-" + moment()
                        .endOf('isoWeek')
                        .add(X_COUNT * offset, 'w')
                        .add(i - (X_COUNT - 1), 'w')
                        .format('DD MMM')
                labels.push(str);
            }
        } else if (limit === 'monthly') {
            for (let i = 0; i < X_COUNT; i++) {
                const str = moment()
                    .add(X_COUNT * offset, 'M')
                    .add(i - (X_COUNT - 1), 'M')
                    .format('MMM YY')
                labels.push(str);
            }
        }

        // console.debug(labels)
        setLabels(labels);
    }

    return (
        <div>
            <h6>
                {chartLabel}<wbr />
                <span className="loader-container-2" >
                    <span className="ms-1 loader-2" style={{ display: showLoader ? "inline" : "none" }}></span>
                </span>
            </h6>

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