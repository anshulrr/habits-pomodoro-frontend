import { useEffect, useState } from "react"
import { getPomodorosApi } from "../services/api/PomodoroApiService";
import moment from "moment"
import { retrieveAllProjectCategoriesApi } from "../services/api/ProjectCategoryApiService";
import { Buttons } from "./charts/Buttons";

export default function ListPomodorosComponent({ includeCategories, buttonsStates, setButtonsStates }) {

    const [pomodoros, setPomodoros] = useState([])

    const [totalTimeElapsed, setTotalTimeElapsed] = useState('00:00');

    useEffect(
        () => {
            // console.debug('re-render ListPomodorosComponent')
            if (!includeCategories) {
                retrieveProjectCategories();
            } else {
                retrieveTodayPomodoros(0, 0)
            }
        }, []   // eslint-disable-line react-hooks/exhaustive-deps
    )

    function retrieveProjectCategories() {
        // todo: decide default limit
        retrieveAllProjectCategoriesApi(100, 0)
            .then(response => {
                retrieveTodayPomodoros(0, 0, response.data.map(c => c.id))
            })
            .catch(error => console.error(error.message))
    }

    function retrieveTodayPomodoros({ startDate, endDate }, allCategories) {
        getPomodorosApi(startDate, endDate, allCategories || includeCategories)
            .then(response => {
                // console.debug(response)
                setPomodoros(response.data)
                const total = response.data.reduce((acc, curr) => acc + Math.round(curr.timeElapsed / 60), 0);
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
                Pomodoros ({totalTimeElapsed})
            </h6>
            {
                includeCategories &&
                <Buttons
                    retrievePomodoros={retrieveTodayPomodoros}
                    buttonsStates={buttonsStates}
                    setButtonsStates={setButtonsStates}
                    showLimit={false}
                />
            }
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