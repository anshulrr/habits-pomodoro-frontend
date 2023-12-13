import { useEffect, useState } from 'react';
import moment from 'moment';

import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

import { getStatsPomodorosCountApi } from 'services/api/PomodoroApiService';
import { timeToDisplay } from 'services/helpers/listsHelper';

export const TaskStats = ({ task, setShowTaskStats }) => {

    const [startDate, setStartDate] = useState(moment().add(window.innerWidth <= 992 ? -0.5 : -1, 'y').toISOString());
    const [endDate, setEndDate] = useState(moment().toISOString());
    const [chartData, setChartData] = useState({ data: [] })

    const [showLoader, setShowLoader] = useState(true)

    useEffect(
        () => {
            retrieveStatsPomodorosCount('task', task.id)
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    const retrieveStatsPomodorosCount = (type, typeId) => {
        setStartDate(startDate);
        setEndDate(endDate);
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

    return (

        <div className="task-overlay">
            <div className="task-popup">
                <div className="close-popup m-2">
                    <i className="p-1 bi bi-x-lg" onClick={() => setShowTaskStats(-1)}></i>
                </div>

                <div className="container my-5">

                    <h6 className="text-start">
                        <i className="me-1 bi bi-list-ul" />
                        {task.description}
                        {
                            showLoader &&
                            <span className="loader-container-2" >
                                <span className="ms-2 loader-2"></span>
                            </span>
                        }
                    </h6>
                    <div className="row small">
                        <div className="col-4">
                            Today's Time
                            <div className="">
                                <i className="px-1 bi bi-clock-fill" />
                                {task.todaysTimeElapsed !== undefined ? timeToDisplay(task.todaysTimeElapsed / 60) : 0}
                            </div>
                        </div>
                        <div className="col-4">
                            Total Time
                            <div className="">
                                <i className="px-1 bi bi-clock" />
                                {task.totalTimeElapsed !== undefined ? timeToDisplay(task.totalTimeElapsed / 60) : 0}
                            </div>
                        </div>
                        <div className="col-4">
                            Number of Days
                            <div className="">
                                # {chartData.data.length}
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-12 px-0 mt-2">
                        <div className="p-1 chart-card">
                            <CalendarHeatmap
                                startDate={startDate}
                                endDate={endDate}
                                values={chartData.data}
                                showWeekdayLabels={true}
                                classForValue={(value) => {
                                    if (!value) {
                                        return 'color-empty';
                                    }
                                    return `color-${task.type}`;
                                }}
                            />
                        </div >
                    </div >

                </div >
            </div >
        </div >
    )
}

