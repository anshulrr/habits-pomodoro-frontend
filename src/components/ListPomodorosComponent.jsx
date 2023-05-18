import { useEffect, useState } from "react"
import { getPomodorosApi, getProjectsPomodorosApi } from "../services/api/PomodoroApiService";
import moment from "moment"
import { BarChart } from "./BarChart";


export default function ListTasksComponent() {

    const [pomodoros, setPomodoros] = useState([])

    const [chartData, setChartData] = useState(data)

    // for first time load
    useEffect(
        () => retrieveTodayPomodoros(),
        []
    )

    // for first time load
    useEffect(
        () => retrieveProjectsPomodoros('daily'),
        []
    )

    // for reload after click
    useEffect(
        () => console.log('chartData is updated'),
        [chartData]
    )

    function retrieveTodayPomodoros() {
        getPomodorosApi()
            .then(response => {
                console.log(response)
                setPomodoros(response.data)
            })
            .catch(response => console.log(response))
    }

    function retrieveProjectsPomodoros(limit) {
        getProjectsPomodorosApi(limit ? limit : 'daily')
            .then(response => {
                // console.log(response)
                data.labels = [];
                data.datasets[0].data = [];
                data.datasets.label = `Project's Focus Time (${limit})`;
                response.data.forEach(element => {
                    // console.log(element);
                    data.labels.push(element[1]);
                    data.datasets[0].data.push(element[0]);
                });
                // console.log(data);
                // note: setting the same refrences doesn't make any change for useEffect
                setChartData(structuredClone(data))
                // console.log("retrieved updated data: ", chartData);
            })
            .catch(response => console.log(response))
    }

    return (
        <div className="container">
            <h1>Today's pomodoros</h1>
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Start Time</th>
                            <th>End Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            pomodoros.map(
                                pomodoro => (
                                    <tr key={pomodoro.id}>
                                        <td>
                                            {moment.utc(pomodoro.startTime).local().format('H:mm')}
                                        </td>
                                        <td>
                                            {moment.utc(pomodoro.endTime).local().format('H:mm')}
                                        </td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>

                </table>
            </div >

            <button type="button" class="btn btn-light" onClick={() => retrieveProjectsPomodoros('daily')}>Daily</button>
            <button type="button" class="btn btn-light" onClick={() => retrieveProjectsPomodoros('weekly')}>Weekly</button>
            <button type="button" class="btn btn-light" onClick={() => retrieveProjectsPomodoros('monthly')}>Monthly</button>

            <BarChart chartData={chartData} />
        </div >
    )
}

const data = {
    labels: [],
    // datasets is an array of objects where each object represents a set of data to display corresponding to the labels above. for brevity, we'll keep it at one object
    datasets: [
        {
            label: 'time in minutes',
            data: [],
            // you can set indiviual colors for each bar
            borderWidth: 1,
            barThickness: 6,  // number (pixels) or 'flex'
            maxBarThickness: 8 // number (pixels)
        }
    ]
}