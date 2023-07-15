import { useEffect, useState } from "react"
import { getPomodorosApi } from "../services/api/PomodoroApiService";
import moment from "moment"

export default function ListPomodorosComponent({ includeCategories }) {

    const [pomodoros, setPomodoros] = useState([])

    useEffect(
        () => {
            // console.log('re-render ListPomodorosComponent')
            retrieveTodayPomodoros()
        }, []   // eslint-disable-line react-hooks/exhaustive-deps
    )

    function retrieveTodayPomodoros() {
        if (includeCategories.length === 0) {
            // console.log('categories length is zero')
            return;
        }
        getPomodorosApi(includeCategories)
            .then(response => {
                // console.log(response)
                setPomodoros(response.data)
            })
            .catch(response => console.log(response))
    }

    return (
        <>
            <h6>Today's pomodoros</h6>
            <small>
                <table className="table table-sm table-striped">
                    <tbody>
                        {
                            pomodoros.map(
                                pomodoro => (
                                    <tr key={pomodoro.id}>
                                        <td className="text-start">
                                            {pomodoro.task}
                                        </td>
                                        <td>
                                            {parseInt(pomodoro.timeElapsed / 60)}
                                        </td>
                                        <td className="text-muted">
                                            {moment.utc(pomodoro.startTime).local().format('H:mm')}-
                                            {moment.utc(pomodoro.endTime).local().format('H:mm')}
                                        </td>
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
            </small>
        </ >
    )
}