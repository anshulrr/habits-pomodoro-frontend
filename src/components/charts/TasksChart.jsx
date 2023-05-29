import { useEffect, useState } from "react"
import { getTasksPomodorosApi } from "../../services/api/PomodoroApiService";

import moment from "moment"

import { Bar } from "react-chartjs-2";

import { CategoryScale } from 'chart.js';
import Chart from 'chart.js/auto';
Chart.register(CategoryScale);

export const TasksChart = () => {
    // console.log("hi", chartData);

    const [chartData, setChartData] = useState({})

    const [limit, setLimit] = useState('daily');

    const [offset, setOffset] = useState(0)

    const [dateString, setDateString] = useState(moment().format('DD MMM'));

    // for first time load
    useEffect(
        () => retrieveTasksPomodoros('daily'),
        []
    )

    // to retrive data after click on bottons
    useEffect(
        () => retrieveTasksPomodoros(),
        [offset, limit]
    )

    // for reload data retrival
    useEffect(
        () => console.log('reload chart'),
        [chartData]
    )

    function retrieveTasksPomodoros() {
        console.log(limit, offset)
        getTasksPomodorosApi(limit, offset)
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

    function updateOffset(val) {
        updateDateString(limit, offset + val)
        setOffset(offset + val);
    }

    function updateLimit(val) {
        updateDateString(val, 0)
        setLimit(val);
        setOffset(0);
    }

    // need to get updated limit and offset (to avoid asynchronous execution)
    function updateDateString(limit, offset) {
        // console.log('updated limit & offset: ', limit, offset)
        if (limit == 'daily') {
            setDateString(moment().add(offset, 'd').format('DD MMM'))
        } else if (limit == 'weekly') {
            const str = moment().add(offset, 'w').format('DD MMM') + "-" + moment().add(offset + 1, 'w').format('DD MMM')
            setDateString(str)
        } else if (limit == 'monthly') {
            const str = moment().add(offset, 'M').format('MMM')
            setDateString(str)
        }
    }

    return (
        <div>
            <button type="button" class="btn btn-light" onClick={() => updateLimit('daily')}>Daily</button>
            <button type="button" class="btn btn-light" onClick={() => updateLimit('weekly')}>Weekly</button>
            <button type="button" class="btn btn-light" onClick={() => updateLimit('monthly')}>Monthly</button>
            <div className="container">

                <div className="row">
                    <div className="col-3">
                        <button type="button" class="btn btn-light" onClick={() => updateOffset(-1)}>prev</button>
                    </div>
                    <div className="col-6">
                        <small>
                            {dateString}
                        </small>
                    </div>
                    <div className="col-3">
                        <button type="button" class="btn btn-light" onClick={() => updateOffset(1)}>next</button>
                    </div>
                </div>
            </div>

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
                        plugins: {
                            title: {
                                display: true,
                                text: `Project's Focus Time (${chartData.label})`
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