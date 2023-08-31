import { useEffect, useRef, useState } from "react"
import moment from "moment"

import { deletePastPomodoroApi, getPomodorosApi } from "services/api/PomodoroApiService";
import { retrieveAllProjectCategoriesApi } from "services/api/ProjectCategoryApiService";
import { timeToDisplay } from "services/helpers/listsHelper";

import { Buttons } from "components/stats/charts/Buttons";
import ListCommentsComponent from "components/features/comments/ListCommentsComponents";
import OutsideAlerter from "services/hooks/OutsideAlerter";

export default function ListPomodorosComponent({ includeCategories, buttonsStates, setButtonsStates, setPomodorosListReload }) {

    const ref = useRef(null);

    const [pomodoros, setPomodoros] = useState([])

    const [totalTimeElapsed, setTotalTimeElapsed] = useState('0');

    const [showCommentsId, setShowCommentsId] = useState(-1);
    const [commentsTitle, setCommentsTitle] = useState('')

    const [showPomodoroUpdateId, setShowPomodoroUpdateId] = useState(-1);

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
                setTotalTimeElapsed(timeToDisplay(total));
            })
            .catch(error => console.error(error.message))
    }

    function deleltePastPomodoro(id) {
        if (!window.confirm("Are you sure? Press OK to delete.")) {
            return;
        }
        deletePastPomodoroApi(id)
            .then(response => {
                // console.debug(response)
                setPomodorosListReload(prevReload => prevReload + 1)
            })
            .catch(error => console.error(error.message))
    }

    function updateCommentsData(pomodoro) {
        setShowCommentsId(pomodoro.id)

        setCommentsTitle(
            pomodoro.task + ": " +
            moment.utc(pomodoro.endTime).local().format('YYYY MMM Do') + ' (' +
            moment.utc(pomodoro.startTime).local().format('H:mm') + '-' +
            moment.utc(pomodoro.endTime).local().format('H:mm') + ')'
        )
    }

    return (
        <div>
            <h6>
                <span>
                    Total Time
                </span>
                <span className="ms-1 badge rounded-pill text-bg-secondary">
                    {totalTimeElapsed}
                    <i className="ms-1 bi bi-clock" />
                </span>
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

            {
                pomodoros.length === 0 &&
                <div className="alert alert-light small text-center">
                    <i className="pe-1 bi bi-clipboard-data" />
                    Nothing to display
                </div>
            }

            <table className="table table-sm table-striped small mt-2">
                <tbody>
                    {
                        pomodoros.map(
                            pomodoro => (
                                <tr key={pomodoro.id} className="task-list-row" onClick={() => setShowPomodoroUpdateId(pomodoro.id)} >
                                    <td className="text-start text-secondary" style={{ paddingTop: "0.4rem", paddingBottom: "0.4rem", lineHeight: 1.3 }}>
                                        {pomodoro.task}
                                    </td>
                                    <td width="45%" className="align-middle text-end">
                                        {showPomodoroUpdateId !== pomodoro.id &&
                                            <span className="task-list-details">
                                                <span className="small text-secondary me-1">
                                                    {
                                                        pomodoro.status !== 'past' &&
                                                        <span>
                                                            {moment.utc(pomodoro.startTime).local().format('H:mm')}-
                                                        </span>
                                                    }
                                                    <span>
                                                        {moment.utc(pomodoro.endTime).local().format('H:mm')}
                                                    </span>
                                                </span>
                                                <span className="badge rounded-pill text-bg-secondary fw-normal">
                                                    {timeToDisplay(Math.round(pomodoro.timeElapsed / 60))}
                                                    <i className="ps-1 bi bi-clock" />
                                                </span>
                                            </span>
                                        }
                                        {
                                            showPomodoroUpdateId === pomodoro.id &&
                                            <OutsideAlerter handle={() => setShowPomodoroUpdateId(-1)}>
                                                <div className="input-group justify-content-end">
                                                    {
                                                        pomodoro.status === 'past' &&
                                                        <button type="button" className="btn btn-sm btn-outline-danger py-0 px-2" onClick={() => deleltePastPomodoro(pomodoro.id)}>
                                                            <i className="align-middle bi bi-trash" />
                                                        </button>
                                                    }
                                                    <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2" onClick={() => updateCommentsData(pomodoro)}>
                                                        <i className="align-middle bi bi-chat-right-text" />
                                                    </button>

                                                </div>
                                            </OutsideAlerter>
                                        }
                                    </td>
                                </tr>
                            )
                        )
                    }
                </tbody>
            </table>
            {
                showCommentsId !== -1 &&
                <ListCommentsComponent
                    filterBy={'pomodoro'}
                    id={showCommentsId}
                    title={commentsTitle}
                    setShowCommentsId={setShowCommentsId}
                />
            }
        </div>
    )
}