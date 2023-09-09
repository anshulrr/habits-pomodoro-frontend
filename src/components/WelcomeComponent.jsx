import { useState } from 'react';
import { useLocation } from 'react-router-dom'

import moment from 'moment';

import ListProjectsComponent from './features/projects/ListProjectsComponents';
import ListTasksComponent from './features/tasks/ListTasksComponent';

export default function WelcomeComponent() {

    const { state } = useLocation();

    const [project, setProject] = useState(state && state.project)

    const [tasksTitle, setTasksTitle] = useState('');


    const [startDate, setStartDate] = useState(moment().startOf('day').toISOString())
    const [endDate, setEndDate] = useState(moment().endOf('day').toISOString())
    const [isReversed, setReversed] = useState(false);

    function fetchUpcomingTasks() {
        setTasksTitle('Upcoming')
        setProject(null);
        setReversed(true);
        setStartDate(moment().toISOString());
        setEndDate(moment().add(10, 'y').toISOString());
    }

    function fetchOverdueTasks() {
        setTasksTitle('Overdue')
        setProject(null);
        setReversed(false);
        setStartDate(moment().add(-10, 'y').toISOString());
        setEndDate(moment().toISOString());
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-4 text-start">
                    <ListProjectsComponent
                        project={project}
                        setProject={setProject}
                    />

                    <div className="border-bottom">
                        <h6 className="px-2">
                            Task Filters
                        </h6>
                        <div className={(!project && tasksTitle === "Upcoming" ? "list-selected " : "") + "px-2 py-1 small list-row"} onClick={fetchUpcomingTasks}>
                            <i className="px-1 bi bi-calendar-check" />
                            Upcoming
                        </div>
                        <div className={(!project && tasksTitle === "Overdue" ? "list-selected " : "") + "px-2 py-1 small list-row"} onClick={fetchOverdueTasks}>
                            <i className="px-1 bi bi-calendar-check text-danger" />
                            Overdue
                        </div>
                    </div>
                </div>
                <div className="col-lg-8">
                    {
                        project &&
                        <ListTasksComponent
                            key={project.id}
                            project={project}
                        />
                    }
                    {
                        !project &&
                        <ListTasksComponent
                            key={[startDate, endDate]}
                            startDate={startDate}
                            endDate={endDate}
                            isReversed={isReversed}
                            title={tasksTitle}
                        />
                    }
                </div>
            </div>


        </div>
    )
}