import { Link, useLocation } from 'react-router-dom'
import ListFilteredTasksComponent from './home/ListFilteredTasksComponent';
import { useState } from 'react';
import moment from 'moment';

export default function WelcomeComponent({ username }) {

    const { state } = useLocation();

    const [startDate, setStartDate] = useState(moment().startOf('day').toISOString())
    const [endDate, setEndDate] = useState(moment().endOf('day').toISOString())
    const [isReversed, setReversed] = useState(false);

    function fetchUpcomingTasks() {
        setReversed(true);
        setStartDate(moment().toISOString());
        setEndDate(moment().add(10, 'y').toISOString());
    }

    function fetchOverdueTasks() {
        setReversed(false);
        setStartDate(moment().add(-10, 'y').toISOString());
        setEndDate(moment().toISOString());
    }

    return (
        <div className="WelcomeComponent">
            <div className="container">

                <div className="row">
                    <div className="col-lg-4 text-start">
                        <div className="py-1 small list-row" onClick={fetchUpcomingTasks}>
                            <i className="px-1 bi bi-calendar-check" />
                            Upcomping
                        </div>
                        <div className="py-1 small list-row" onClick={fetchOverdueTasks}>
                            <i className="px-1 bi bi-calendar-check text-danger" />
                            Overdue
                        </div>
                    </div>
                    <div className="col-lg-8">
                        <ListFilteredTasksComponent
                            key={[startDate, endDate]}
                            startDate={startDate}
                            endDate={endDate}
                            isReversed={isReversed}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}