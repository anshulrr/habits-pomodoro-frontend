import { useEffect, useState } from "react"
import moment from "moment"

import { getTotalPomodorosApi } from "../../services/api/PomodoroApiService"
import { Buttons } from "./Buttons";

import { Bar } from "react-chartjs-2"

import { CategoryScale } from 'chart.js'
import Chart from 'chart.js/auto'
Chart.register(CategoryScale)

export const TotalChart = () => {
    const [datasets, setDatasets] = useState([])

    const [labels, setLabels] = useState([])

    // for first time load
    useEffect(
        () => {
            retrieveTotalPomodoros('daily', 0)
            updateLabels('daily')
        },
        []
    )

    // for reload data retrival
    useEffect(
        () => console.log('reload chart'),
        [datasets]
    )

    function retrieveTotalPomodoros(limit, offset) {
        updateLabels(limit, offset)
        getTotalPomodorosApi(limit, offset)
            .then(response => {
                console.log("stacked", response)
                const temp_datasets = [];

                for (const key in response.data) {
                    // console.log(key);
                    const dataset = {
                        lable: key,
                        backgroundColor: response.data[key][0][3],
                        data: new Array(15).fill(0)
                    }
                    if (limit == 'daily') {
                        for (const val of response.data[key]) {
                            // console.log(val[0], 14 - (moment().format('DD') - val[0]));
                            dataset.data[14 - (moment().format('DD') - val[0])] = val[1];
                        }
                    } else if (limit == 'weekly') {
                        for (const val of response.data[key]) {
                            // console.log(val[0], val[1], moment().format('W'));
                            dataset.data[14 - (moment().format('W') - val[0])] = val[1];
                        }
                    } else if (limit == 'monthly') {

                    }
                    temp_datasets.push(dataset);
                }
                // console.log(temp_datasets)
                setDatasets(temp_datasets);
                // setDatasets(structuredClone(datasets))
            })
            .catch(response => console.log(response))
    }

    function updateLabels(limit, offset) {
        const labels = [];
        if (limit == 'daily') {
            for (let i = 0; i < 15; i++) {
                const str = moment()
                    .add(15 * offset, 'd')
                    .add(-14 + i, 'd')
                    .format('DD MMM')
                labels.push(str)
            }
        } else if (limit == 'weekly') {
            const dow = moment().format('e');
            for (let i = 0; i < 15; i++) {
                const str = moment()
                    .add(-dow + 1, 'd')
                    .add(15 * 7 * offset, 'd')
                    .add(i - 14, 'w')
                    .format('DD MMM')
                    + "-" + moment()
                        .add(-dow, 'd')
                        .add(15 * 7 * offset, 'd')
                        .add(i + 1 - 14, 'w')
                        .format('DD MMM')
                labels.push(str);
            }
        } else if (limit == 'monthly') {
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
            <Buttons retrievePomodoros={retrieveTotalPomodoros} showDateString={false}></Buttons>

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
                        plugins: {
                            title: {
                                display: true,
                                text: `Total Time (daily)`
                            },
                            legend: {
                                display: false
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