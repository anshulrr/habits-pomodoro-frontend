import { useEffect, useState } from "react"
import { getPomodorosApi, getProjectsPomodorosApi } from "../services/api/PomodoroApiService";
import moment from "moment"
import { ProjectsChart } from "./ProjectsChart";
import { ProjectsDistributionChart } from "./ProjectsDistributionChart";


export default function ListTasksComponent() {

    const [pomodoros, setPomodoros] = useState([])

    const [chartData, setChartData] = useState({})

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
                const updated_data = {
                    labels: [],
                    data: [],
                    label: limit
                }
                response.data.forEach(element => {
                    // console.log(element);
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
        <div className="container">

            <button type="button" class="btn btn-light" onClick={() => retrieveProjectsPomodoros('daily')}>Daily</button>
            <button type="button" class="btn btn-light" onClick={() => retrieveProjectsPomodoros('weekly')}>Weekly</button>
            <button type="button" class="btn btn-light" onClick={() => retrieveProjectsPomodoros('monthly')}>Monthly</button>


            <div className="row">
                <div className="col-6">
                    <ProjectsChart chartData={chartData} />
                </div>
                <div className="col-4 offset-1">
                    <ProjectsDistributionChart chartData={chartData} />
                </div>
            </div>

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

        </div >
    )
}