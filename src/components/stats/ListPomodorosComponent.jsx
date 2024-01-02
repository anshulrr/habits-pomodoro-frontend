import { useEffect, useRef, useState } from "react"
import moment from "moment"

import { deletePastPomodoroApi, getPomodorosApi } from "services/api/PomodoroApiService";
import { timeToDisplay } from "services/helpers/listsHelper";

import { Buttons } from "components/stats/charts/Buttons";
import ListCommentsPopupComponent from "components/features/comments/ListCommentsPopupComponent";
import OutsideAlerter from "services/hooks/OutsideAlerter";

export default function ListPomodorosComponent({
    includeCategories,
    subject,
    buttonsStates,
    setButtonsStates,
    title = "Pomodoros",
    elementHeight,
    setElementHeight,
    setTodaysPomodorosMap,
    setProjects,
    setTasksComponentReload
}) {

    const listElement = useRef(null);

    const [pomodorosGroup, setPomodorosGroup] = useState([])
    const [pomodorosCount, setPomodorosCount] = useState(-1);

    const [totalTimeElapsed, setTotalTimeElapsed] = useState('0');

    const [showCommentsId, setShowCommentsId] = useState(-1);
    const [commentsTitle, setCommentsTitle] = useState('')

    const [reload, setReload] = useState(0);

    const [showPomodoroUpdateId, setShowPomodoroUpdateId] = useState(-1);

    useEffect(
        () => {
            // console.debug('re-render ListPomodorosComponent')
            async function fetchAPI() {
                try {
                    if (title === "Today's Pomodoros") {
                        // TODO: decide limit
                        // TODO: find better way of getting all categories
                        // console.debug('useEffect', { includeCategories })
                        // initial state
                        const startDate = moment().startOf('day').toISOString();
                        const endDate = moment().startOf('day').add(1, 'd').toISOString();
                        retrieveTodayPomodoros({ startDate, endDate })
                    }
                } catch (error) {
                    console.error(error.message)
                }
            }
            fetchAPI()

            const observer = new ResizeObserver(handleResize);
            observer.observe(listElement.current);
            return () => {
                // Cleanup the observer by unobserving all elements
                observer.disconnect();
            };
        }, [reload]   // eslint-disable-line react-hooks/exhaustive-deps
    )

    const handleResize = () => {
        if (listElement.current !== null) {
            // console.debug(listElement.current.offsetHeight);
            setElementHeight(listElement.current.offsetHeight);
        }
    }

    function retrieveTodayPomodoros({ startDate, endDate }) {
        // console.debug('api call', { allCategories, includeCategories })
        setPomodorosGroup([]);
        setPomodorosCount(-1);
        getPomodorosApi({ startDate, endDate, includeCategories, subject })
            .then(response => {
                // console.debug(response)
                response.data.map((x, index) => x.index = response.data.length - index);

                const timeSlots = groupBy(response.data, 'endTime');
                setPomodorosGroup(timeSlots.reverse());
                for (let i = 0; i < timeSlots.length; i++) {
                    timeSlots[i].totalTimeElapsed = timeSlots[i].reduce((acc, curr) => acc + Math.round(curr.timeElapsed / 60), 0);
                }
                // console.debug(timeSlots);

                // update today's project's time elapsed
                updateTodaysProjectsTimeElapsed(response.data);

                setPomodorosCount(response.data.length);
                const total = response.data.reduce((acc, curr) => acc + Math.round(curr.timeElapsed / 60), 0);
                setTotalTimeElapsed(timeToDisplay(total));
            })
            .catch(error => console.error(error.message))
    }

    function updateTodaysProjectsTimeElapsed(pomodoros) {
        if (title !== "Today's Pomodoros") {
            return;
        }
        const map = new Map();
        for (let i = 0; i < pomodoros.length; i++) {
            const pomodoro = pomodoros[i];
            const projectId = parseInt(pomodoro.projectId);
            if (map.has(projectId)) {
                map.set(projectId, map.get(projectId) + pomodoro.timeElapsed);
            } else {
                map.set(projectId, pomodoro.timeElapsed);
            }
        }
        // for projects component
        setTodaysPomodorosMap(map)
        setProjects(projects => projects.map((project) => {
            // console.log(project.id)
            if (map.has(project.id)) {
                project.timeElapsed = map.get(project.id);
            }
            return project;
        }))
    }

    function deleltePastPomodoro(pomodoro) {
        if (!window.confirm("Are you sure? Press OK to delete.")) {
            return;
        }
        deletePastPomodoroApi(pomodoro.id)
            .then(response => {
                // console.debug(response)
                setReload(prev => prev + 1);
                if (setTasksComponentReload) {
                    setTasksComponentReload(prev => prev + 1);
                }
                // const total = pomodorosGroup.reduce((acc, curr) => acc + Math.round(curr.timeElapsed / 60), 0);
                // setTotalTimeElapsed(timeToDisplay(total - pomodoro.timeElapsed / 60));
                // setPomodorosGroup(pomodorosGroup.filter(p => p.id !== pomodoro.id))
            })
            .catch(error => console.error(error.message))
    }

    function updateCommentsData(pomodoro) {
        setShowCommentsId(pomodoro.taskId)
        setCommentsTitle(
            pomodoro.task
        )
    }

    const groupBy = function (arr, key) {
        return arr.reduce(function (result, x) {
            // console.debug(x);
            let index = Math.floor(moment(x[key]).format('H') / 3);
            (result[index]).push(x);
            return result;
        }, [[], [], [], [], [], [], [], []]);
    };

    return (
        <div>
            <h6>
                <span>
                    {title}
                </span>
                <span className="ms-1 badge rounded-pill text-bg-secondary">
                    {totalTimeElapsed}
                    <i className="ms-1 bi bi-clock" />
                </span>
            </h6>
            {
                title === 'Pomodoros' &&
                <div className="mb-2">
                    <Buttons
                        key={[reload]}
                        retrievePomodoros={retrieveTodayPomodoros}
                        buttonsStates={buttonsStates}
                        setButtonsStates={setButtonsStates}
                        showLimit={false}
                    />
                </div>
            }

            {
                pomodorosCount === 0 &&
                <div className="alert alert-light small text-center mb-0">
                    <i className="pe-1 bi bi-clipboard-data" />
                    Nothing to display
                </div>
            }

            {
                pomodorosCount === -1 &&
                <div className="loader-container" style={{ height: elementHeight }}>
                    <div className="loader"></div>
                </div>
            }

            <div id="pomodoros-group-list" ref={listElement} className="small">
                <div>
                    {
                        pomodorosGroup.map(
                            (timeSlots, index) => (
                                <div key={"slot-" + index}>
                                    {
                                        timeSlots.length > 0 &&
                                        <div className="small text-end pomodoro-list-time-slot">
                                            <div className="small badge rounded-pill text-bg-secondary fw-normal">
                                                {timeToDisplay(Math.round(timeSlots.totalTimeElapsed))}
                                                <i className="ms-1 bi bi-clock" />
                                            </div>
                                            <div className="ms-1 small badge rounded-pill text-bg-secondary fw-normal">
                                                {timeSlots.length > 0 ? ((8 - 1 - index) * 3) + ":00 - " + ((8 - index) * 3) + ":00" : ""}
                                            </div>
                                        </div>
                                    }
                                    {
                                        timeSlots.map(
                                            (pomodoro) => (
                                                <div key={pomodoro.id}
                                                    className={"update-list-row pomodoro-list-row" + (showPomodoroUpdateId === pomodoro.id ? " pomodoro-list-row-selected" : "")}
                                                    onClick={() => !subject && setShowPomodoroUpdateId(pomodoro.id)} >
                                                    <div className="mx-2 d-flex text-start small text-secondary">
                                                        <div className={"flex-grow-1 " + (!subject ? "update-popup-container" : "")}>
                                                            <span>
                                                                {pomodoro.index}. {pomodoro.task}
                                                            </span>
                                                            <span className="align-middle" style={{ float: "right" }}>
                                                                {showPomodoroUpdateId !== pomodoro.id &&
                                                                    <span className="task-list-details small">
                                                                        <span className="me-1">
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
                                                                        <span className="">
                                                                            <i className="bi bi-clock-fill" style={{ paddingRight: "0.1rem" }} />
                                                                            <span style={{ fontVariantNumeric: "tabular-nums" }}>
                                                                                {timeToDisplay(Math.round(pomodoro.timeElapsed / 60))}
                                                                            </span>
                                                                        </span>
                                                                        <span className="ms-1" style={{ color: pomodoro.color }}>&#9632;</span>
                                                                    </span>
                                                                }

                                                            </span>

                                                            {
                                                                showPomodoroUpdateId === pomodoro.id &&
                                                                <OutsideAlerter handle={() => setShowPomodoroUpdateId(-1)}>
                                                                    <span className="">
                                                                        <div className="update-popup pomodoro-list-popup">
                                                                            <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-2 lh-sm" onClick={() => updateCommentsData(pomodoro)}>
                                                                                Notes <i className="align-middle bi bi-journal-text" />
                                                                            </button>
                                                                            {
                                                                                pomodoro.status === 'past' &&
                                                                                <button type="button" className="btn btn-sm btn-outline-danger py-0 px-2 lh-sm" onClick={() => deleltePastPomodoro(pomodoro)}>
                                                                                    Delete <i className="align-middle bi bi-trash" />
                                                                                </button>
                                                                            }

                                                                        </div>
                                                                    </span>
                                                                </OutsideAlerter>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )
                                    }
                                </div>

                            )
                        )
                    }
                </div>
            </div>
            {
                showCommentsId !== -1 &&
                <div className="text-body">
                    <ListCommentsPopupComponent
                        filterBy={'task'}
                        id={showCommentsId}
                        title={commentsTitle}
                        setShowCommentsId={setShowCommentsId}
                    />
                </div>
            }
        </div>
    )
}