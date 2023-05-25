import { useEffect, useState } from "react"
import { getTotalPomodorosApi } from "../../services/api/PomodoroApiService";

import { Bar } from "react-chartjs-2";

import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
Chart.register(CategoryScale);

export const TotalChart = () => {
    const [datasets, setDatasets] = useState([])

    // for first time load
    useEffect(
        () => retrieveTotalPomodoros('daily'),
        []
    )

    // for reload after click
    useEffect(
        () => console.log('chartData is updated'),
        [datasets]
    )

    function retrieveTotalPomodoros(limit) {
        getTotalPomodorosApi(limit ? limit : 'daily')
            .then(response => {
                // console.log("stacked", response)
                const temp_datasets = [];

                for (const key in response.data) {
                    // console.log(key);
                    const dataset = {
                        lable: key,
                        backgroundColor: response.data[key][0][3],
                        data: new Array(32).fill(0)
                    }
                    for (const val of response.data[key]) {
                        // console.log(val[0], val[1]);
                        dataset.data[val[0]] = +val[1];
                    }
                    temp_datasets.push(dataset);
                }
                // console.log(temp_datasets)
                setDatasets(temp_datasets);
                // setDatasets(structuredClone(datasets))
            })
            .catch(response => console.log(response))
    }

    return (
        <div className="chart-container">
            <Bar
                data={
                    {
                        labels: Array.from(Array(32).keys()),
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
    );
};