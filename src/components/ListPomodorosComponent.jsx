import { useEffect, useState } from "react"
import moment from "moment"

import { Buttons } from "./charts/Buttons";
import { deletePastPomodoroApi, getPomodorosApi } from "../services/api/PomodoroApiService";
import { retrieveAllProjectCategoriesApi } from "../services/api/ProjectCategoryApiService";

export default function ListPomodorosComponent({ includeCategories, buttonsStates, setButtonsStates, setPomodorosListReload }) {

    const [pomodoros, setPomodoros] = useState([])

    const [totalTimeElapsed, setTotalTimeElapsed] = useState('00:00');

    const [deleteErrorMessage, setDeleteErrorMessage] = useState('');
    const [deleteId, setDeleteId] = useState(-1);

    useEffect(
        () => {
            // console.debug('re-render ListPomodorosComponent')
            async function fetchAPI() {
                try {
                    if (!includeCategories) {
                        // todo: decide limit
                        const response = await retrieveAllProjectCategoriesApi(100, 0);
                        const allCategories = response.data.map(c => c.id);
                        // console.debug('useEffect', { allCategories, includeCategories })
                        // initial state
                        const startDate = moment().startOf('day').toISOString();
                        const endDate = moment().startOf('day').add(1, 'd').toISOString();
                        retrieveTodayPomodoros({ startDate, endDate, allCategories })
                    }
                } catch (error) {
                    console.error(error.message)
                }
            }
            fetchAPI()
        }, []   // eslint-disable-line react-hooks/exhaustive-deps
    )

    function retrieveTodayPomodoros({ startDate, endDate, allCategories }) {
        // console.debug('api call', { allCategories, includeCategories })
        getPomodorosApi({ startDate, endDate, includeCategories: allCategories || includeCategories })
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

    function deleltePastPomodoro(id) {
        setDeleteErrorMessage('')
        if (deleteId !== id) {
            setDeleteId(id)
            setDeleteErrorMessage('Click again to delete: ' + id)
            return
        }
        deletePastPomodoroApi(id)
            .then(response => {
                // console.debug(response)
                setPomodorosListReload(prevReload => prevReload + 1)
                setDeleteErrorMessage('')
            })
            .catch(error => console.error(error.message))
    }

    return (
        <>
            <h6>
                Pomodoros ({totalTimeElapsed})
            </h6>
            <div className="text-danger"><small>{deleteErrorMessage}</small></div>
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
                                        < td >
                                            {
                                                pomodoro.status === 'past' &&
                                                <i className="bi bi-trash" onClick={() => deleltePastPomodoro(pomodoro.id)} />
                                            }
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