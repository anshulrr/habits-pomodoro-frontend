import { useEffect, useState } from "react"
import { getPomodorosApi } from "../services/api/PomodoroApiService";
import moment from "moment"
import { TasksChart } from "./charts/TasksChart";
import { ProjectsDistributionChart } from "./charts/ProjectsDistributionChart";

export default function ListTasksComponent() {

    const [pomodoros, setPomodoros] = useState([])

    // for first time load
    useEffect(
        () => retrieveTodayPomodoros(),
        []
    )

    function retrieveTodayPomodoros() {
        getPomodorosApi()
            .then(response => {
                console.log(response)
                setPomodoros(response.data)
            })
            .catch(response => console.log(response))
    }

    return (
        <div className="container">

            <div className="row">
                <div className="col-6">
                    <TasksChart />
                </div>
                <div className="col-4 offset-1">
                    <ProjectsDistributionChart />
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