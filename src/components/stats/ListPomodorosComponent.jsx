import { useEffect, useRef, useState } from "react"
import { useLiveQuery } from "dexie-react-hooks";
import moment from "moment"

import { timeToDisplay } from "services/helpers/listsHelper";

import { Buttons } from "components/stats/charts/Buttons";
import ListCommentsComponent from "components/features/comments/ListCommentsComponent";
import OutsideAlerter from "services/hooks/OutsideAlerter";
import { getItemFromCache, getPomodorosFromCache, modifyItemInCache, syncDirtyItems } from "services/dbService";
import { useData } from "services/DataContext";

export default function ListPomodorosComponent({
    includeCategories,
    subject,
    buttonsStates,
    setButtonsStates,
    title = "Pomodoros",
    elementHeight,
    setChartReload
}) {

    const dataContext = useData();

    const listElement = useRef(null);

    const [pomodorosGroup, setPomodorosGroup] = useState([])
    const [pomodorosCount, setPomodorosCount] = useState(-1);

    const pomodoros = useLiveQuery(async () => {
        const retrievedPomodoros = await getPomodorosFromCache({
            startDate: moment().startOf('day').toISOString(),
            endDate: moment().startOf('day').add(1, 'd').toISOString(),
            includeCategories
        });
        console.debug(`Retrieved pomodoros from cache after update:`, { retrievedPomodoros });

        retrievedPomodoros.map((x, index) => x.index = retrievedPomodoros.length - index);

        const timeSlots = groupBy(retrievedPomodoros, 'endTime');
        setPomodorosGroup(timeSlots.reverse());
        for (let i = 0; i < timeSlots.length; i++) {
            timeSlots[i].totalTimeElapsed = timeSlots[i].reduce((acc, curr) => acc + Math.round(curr.timeElapsed / 60), 0);
        }
        // console.debug(timeSlots);

        setPomodorosCount(retrievedPomodoros.length);
        const total = retrievedPomodoros.reduce((acc, curr) => acc + Math.round(curr.timeElapsed / 60), 0);
        setTotalTimeElapsed(timeToDisplay(total));

        return retrievedPomodoros;
    })

    const [totalTimeElapsed, setTotalTimeElapsed] = useState('0');

    const [showCommentsId, setShowCommentsId] = useState(-1);

    const [showPomodoroUpdateId, setShowPomodoroUpdateId] = useState(-1);

    useEffect(
        () => {
            // console.debug('re-render ListPomodorosComponent')
        }, []   // eslint-disable-line react-hooks/exhaustive-deps
    )

    function retrievePomodoros({ startDate, endDate }) {
        // console.debug('api call', { allCategories, includeCategories })
        setPomodorosGroup([]);
        setPomodorosCount(-1);
        getPomodorosFromCache({ startDate, endDate, includeCategories })
            .then(response => {
                // console.debug(response)
                response.map((x, index) => x.index = response.length - index);

                const timeSlots = groupBy(response, 'endTime');
                setPomodorosGroup(timeSlots.reverse());
                for (let i = 0; i < timeSlots.length; i++) {
                    timeSlots[i].totalTimeElapsed = timeSlots[i].reduce((acc, curr) => acc + Math.round(curr.timeElapsed / 60), 0);
                }
                // console.debug(timeSlots);

                setPomodorosCount(response.length);
                const total = response.reduce((acc, curr) => acc + Math.round(curr.timeElapsed / 60), 0);
                setTotalTimeElapsed(timeToDisplay(total));
            })
            .catch(error => console.error(error.message))
    }

    async function deleltePastPomodoro(pomodoro) {
        if (!window.confirm("Are you sure? Press OK to delete.")) {
            return;
        }

        // Use update API instead of delete
        // TODO: check if this is the best solution
        await modifyItemInCache('pomodoros', pomodoro.id, { status: 'deleted', _dirty: 1 });
        syncPomodoros();
    }

    async function syncPomodoros() {
        if (navigator.onLine) {
            console.info(`Online! Syncing deleted dirty pomodoros...`);
            await syncDirtyItems('pomodoros'); // Fire and forget in background
            setTimeout(() => {
                setChartReload(prevReload => prevReload + 1)    // for chart reload
            }, 1000);
        }
    }

    function updateCommentsData(pomodoro) {
        setShowCommentsId(pomodoro.taskId)
    }

    const groupBy = function (arr, key) {
        return arr.reduce(function (result, x) {
            // console.debug(x);
            const time = moment(x[key]);
            let index = Math.floor(time.format('H') / 3);
            // if (time.format('H') % 3 === 0 && time.format('m') === '0') {
            //     // console.log(index);
            //     // edge case: 00:00
            //     // index--;
            // }
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
                    <i className="me-1 bi bi-clock" />
                    {totalTimeElapsed}
                </span>
            </h6>
            {
                title === 'Pomodoros' &&
                <div className="mb-2">
                    <Buttons
                        retrievePomodoros={retrievePomodoros}
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
                                            <div className="ms-1 small badge rounded-pill text-bg-secondary fw-normal">
                                                {timeSlots.length > 0 ? ((8 - 1 - index) * 3) + ":00 - " + ((8 - index) * 3) + ":00" : ""}
                                            </div>
                                            <div className="small badge rounded-pill text-bg-secondary fw-normal">
                                                <i className="me-1 bi bi-clock" />
                                                {timeToDisplay(Math.round(timeSlots.totalTimeElapsed))}
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
                                                                {pomodoro.index}. {dataContext.tasksMap.get(pomodoro.taskId).description}
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
                                                                        <span className="ms-1" style={{ color: dataContext.projectsMap.get(pomodoro.projectId).color }}>&#9632;</span>
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
                                                                            <button type="button" className="btn btn-sm btn-outline-danger py-0 px-2 lh-sm" onClick={() => deleltePastPomodoro(pomodoro)}>
                                                                                Delete <i className="align-middle bi bi-trash" />
                                                                            </button>

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
                    <div className="comments-overlay">
                        <div className="comments-popup">
                            <div className="close-popup m-2">
                                <i className="p-1 bi bi-x-lg" onClick={() => setShowCommentsId(-1)}></i>
                            </div>
                            <div className="container mt-4">
                                <ListCommentsComponent
                                    filterBy={'task'}
                                    id={showCommentsId}
                                />
                            </div >
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}