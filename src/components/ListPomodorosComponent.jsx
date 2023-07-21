import { useEffect, useState } from "react"
import { getPomodorosApi } from "../services/api/PomodoroApiService";
import moment from "moment"

export default function ListPomodorosComponent({ includeCategories }) {

    const [pomodoros, setPomodoros] = useState([])

    const [totalTimeElapsed, setTotalTimeElapsed] = useState('0h0m');

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
                const total = pomodoros.reduce((acc, curr) => acc + Math.round(curr.timeElapsed / 60), 0);
                const hours = Math.floor(total / 60);
                const minutes = total % 60;
                setTotalTimeElapsed(
                    (hours > 9 ? hours : '0' + hours) + ':' +
                    (minutes > 9 ? minutes : '0' + minutes)
                )
            })
            .catch(error => console.error(error.message))
    }

    return (
        <>
            <h6>
                Today's pomodoros ({totalTimeElapsed})
            </h6>
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
                                            {Math.round(pomodoro.timeElapsed / 60)}
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