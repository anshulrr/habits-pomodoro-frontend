import { useEffect, useRef, useState } from 'react';
import moment from 'moment';

import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

import { getStatsPomodorosCountApi, getTaskPomodorosApi, getTaskPomodorosCountApi } from 'services/api/PomodoroApiService';
import { COLOR_MAP, formatDate, timeToDisplay } from 'services/helpers/listsHelper';
import Pagination from 'services/pagination/Pagination';

import { StreakButtons } from "components/stats/charts/StreakButtons";

export const TaskStats = ({ task, setShowTaskStats }) => {

    // const [startDate, setStartDate] = useState(moment().add(window.innerWidth <= 992 ? -0.5 : -1, 'y').toISOString());
    // const [endDate, setEndDate] = useState(moment().toISOString());
    const [chartData, setChartData] = useState({ data: [] })

    const PAGESIZE = 7
    const [pomodorosCount, setPomodorosCount] = useState(0)
    const [pomodoros, setPomodoros] = useState([])
    const [currentPage, setCurrentPage] = useState(1)
    const listElement = useRef(null);

    const [showLoader, setShowLoader] = useState(true)

    const [streakButtonsStates, setStreakButtonsStates] = useState({
        limit: 'current',
        offset: 0,
        dateString: 'Current'
    })

    useEffect(
        () => {
            // retrieveStatsPomodorosCount('task', task.id)
            retrieveTaskPomodorosCount()
            retrieveTaskPomodoros()
        }, [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    useEffect(
        () => {
            retrieveTaskPomodoros()
        }, [currentPage] // eslint-disable-line react-hooks/exhaustive-deps
    )

    const retrieveStatsPomodorosCount = ({ startDate, endDate }) => {
        // setStartDate(startDate);
        // setEndDate(endDate);
        const type = 'task', typeId = task.id;
        getStatsPomodorosCountApi({ startDate, endDate, type, typeId })
            .then(response => {
                const updated_data = {
                    data: [],
                }
                response.data.forEach((element, i) => {
                    updated_data.data.push({
                        date: element[1],
                        count: element[0]
                    })
                });
                setChartData(updated_data)
                setShowLoader(false)
            })
            .catch(error => console.error(error.message))
    }

    const retrieveTaskPomodorosCount = () => {
        getTaskPomodorosCountApi(task.id)
            .then(response => {
                setPomodorosCount(response.data);
            })
            .catch(error => console.error(error.message))
    }

    const retrieveTaskPomodoros = () => {
        setPomodoros([])
        getTaskPomodorosApi(task.id, PAGESIZE, (currentPage - 1) * PAGESIZE)
            .then(response => {
                setPomodoros(response.data);
            })
            .catch(error => console.error(error.message))
    }

    const generateTimeColor = (pomodoro) => {
        // return if dueDate is null or if dueDate doesn't repeat
        if (task.repeatDays === 0) {
            return 'text-dark';
        }
        const endTime = moment.utc(pomodoro.endTime).local();
        const dueTime = moment.utc(task.dueDate).local();
        if (task.type === 'bad') {
            // TODO: decide seperation of due time and restain time with habit type
            if (endTime.hours() < dueTime.hours() || (endTime.hours() === dueTime.hours() && endTime.minutes() < dueTime.minutes())) {
                return 'text-danger';
            } else {
                return 'text-success';
            }
        } else if (task.type === 'good') {
            if (endTime.hours() > dueTime.hours() || (endTime.hours() === dueTime.hours() && endTime.minutes() > dueTime.minutes())) {
                return 'text-danger';
            } else {
                return 'text-success';
            }
        } else if (task.type === 'neutral') {
            if (endTime.hours() < dueTime.hours() || (endTime.hours() === dueTime.hours() && endTime.minutes() < dueTime.minutes())) {
                return 'text-dark';
            } else {
                return 'text-secondary';
            }
        }
        return 'text-secondary';
    }

    return (

        <div className="task-overlay">
            <div className="task-popup">
                <div className="close-popup m-2">
                    <i className="p-1 bi bi-x-lg" onClick={() => setShowTaskStats(-1)}></i>
                </div>

                <div className="container my-5">

                    <div className="row">
                        <div className="col-12">
                            <h6 className="text-start">
                                <i className={"me-1 bi bi-list-ul text-" + COLOR_MAP[task.type]} />
                                {task.description}
                                {
                                    showLoader &&
                                    <span className="loader-container-2" >
                                        <span className="ms-2 loader-2"></span>
                                    </span>
                                }
                            </h6>
                        </div>
                    </div>
                    <div className="row small">
                        <div className="col-4">
                            Today's Time
                            <div className="">
                                <i className="px-1 bi bi-clock-fill" />
                                {task.todaysTimeElapsed !== undefined ? timeToDisplay(task.todaysTimeElapsed / 60, true) : 0}
                            </div>
                        </div>
                        <div className="col-4">
                            Total Time
                            <div className="">
                                <i className="px-1 bi bi-clock" />
                                {task.totalTimeElapsed !== undefined ? timeToDisplay(task.totalTimeElapsed / 60, true) : 0}
                            </div>
                        </div>
                        <div className="col-4">
                            Number of Days
                            <div className="">
                                # {chartData.data.length}
                            </div>
                        </div>
                    </div>

                    <div className="row mt-2">
                        <div className="col-12">
                            <div className="p-1 chart-card">
                                <StreakButtons
                                    retrievePomodoros={retrieveStatsPomodorosCount}
                                    buttonsStates={streakButtonsStates}
                                    setButtonsStates={setStreakButtonsStates}
                                />
                                <CalendarHeatmap
                                    startDate={streakButtonsStates.startDate}
                                    endDate={streakButtonsStates.endDate}
                                    values={chartData.data}
                                    showWeekdayLabels={true}
                                    classForValue={(value) => {
                                        if (!value) {
                                            return 'color-empty';
                                        }
                                        let type = task.type;
                                        if (task.type === 'bad') {
                                            if (value.count > task.pomodoroLength * task.dailyLimit) {
                                                type = 'bad';
                                            } else {
                                                type = `neutral`;
                                            }
                                        }
                                        if (task.type === 'good') {
                                            if (value.count >= task.pomodoroLength * task.dailyLimit) {
                                                type = 'good';
                                            } else {
                                                type = `neutral`;
                                            }
                                        }
                                        // a task above 6 hours has darkest color
                                        const max = 6 * 60;
                                        let range = Math.round(value.count / max * 10) * 10;
                                        range = range <= 100 ? range : 100;
                                        return `color-${type}-${range}`;
                                    }}
                                    tooltipDataAttrs={value => {
                                        if (!value || !value.date) {
                                            return null;
                                        }
                                        return {
                                            'data-tooltip-id': 'streak-tooltip',
                                            'data-tooltip-content': `${value.date}: ${timeToDisplay(value.count, true)}`
                                        };
                                    }}
                                />
                                <Tooltip id="streak-tooltip" />
                            </div >
                        </div >
                    </div >

                    <div className="row small text-dark m-2">
                        <div className="col-lg-4 offset-lg-4">
                            <div className="row small text-start">
                                <div className="col-12">
                                    <h6>
                                        <span>
                                            Pomodoros
                                        </span>
                                        <span className="ms-1 badge rounded-pill text-bg-secondary">
                                            {pomodorosCount}
                                        </span>
                                    </h6>
                                </div>
                                <div className="col-12 border text-center">
                                    <span className="me-1">
                                        <span>
                                            {
                                                (task.dailyLimit === 0 || task.dailyLimit > 3) ?
                                                    <span>
                                                        {task.dailyLimit}<i className="bi bi-hourglass" />
                                                    </span>
                                                    :
                                                    [...Array(task.dailyLimit)].map((e, i) => <i className="bi bi-hourglass" key={i} />)
                                            }
                                        </span>
                                        {timeToDisplay(task.pomodoroLength)}
                                    </span>
                                    {
                                        task.dueDate &&
                                        <span style={{ paddingRight: "0.1rem" }} >
                                            <i className={"bi bi-calendar2-event"} style={{ paddingRight: "0.1rem" }} />
                                            {formatDate(task.dueDate)}
                                        </span>
                                    }
                                    {
                                        task.dueDate && task.repeatDays !== 0 &&
                                        <span>
                                            <i className="bi bi-arrow-repeat" style={{ paddingRight: "0.1rem" }} />
                                            {task.repeatDays}
                                        </span>
                                    }
                                </div>
                            </div>

                            {
                                pomodorosCount !== 0 && pomodoros.length === 0 &&
                                <div className="loader-container" style={{ height: listElement.current ? listElement.current.offsetHeight : 0 }}>
                                    <div className="loader"></div>
                                </div>
                            }

                            <div id="pomodoros-list" ref={listElement}>
                                {
                                    pomodoros.map(
                                        pomodoro => (
                                            <div
                                                key={pomodoro.id}
                                                className="px-1 row pomodoro-list-row"
                                            >
                                                <div className="col-4 text-start">
                                                    <span className="me-1 small">{moment.utc(pomodoro.endTime).local().format('YYYY MMM DD')}</span>
                                                </div>
                                                <div className="col-4 text-end">
                                                    <span className={"me-1 small " + generateTimeColor(pomodoro)}>
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
                                                </div>
                                                <div className="col-4 text-end">
                                                    <span className="small">
                                                        <i className="bi bi-clock-fill" style={{ paddingRight: "0.1rem" }} />
                                                        <span style={{ fontVariantNumeric: "tabular-nums" }}>
                                                            {timeToDisplay(Math.round(pomodoro.timeElapsed / 60))}
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                        )
                                    )
                                }
                            </div>

                            <Pagination
                                className="pagination-bar pagination-scroll mb-0 ps-0"
                                currentPage={currentPage}
                                totalCount={pomodorosCount}
                                pageSize={PAGESIZE}
                                onPageChange={page => setCurrentPage(page)}
                            />
                        </div>
                    </div>

                </div >
            </div >
        </div >
    )
}

