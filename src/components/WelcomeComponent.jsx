import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom'

import ListProjectsComponent from './features/projects/ListProjectsComponents';
import ListTasksComponent from './features/tasks/ListTasksComponent';

export default function WelcomeComponent({ username }) {

    const { state } = useLocation();

    const [project, setProject] = useState(state && state.project)

    return (
        <div className="container">
            <div className="row">
                <div className="col-lg-4">
                    <ListProjectsComponent
                        project={project}
                        setProject={setProject}
                    />
                </div>
                <div className="col-lg-8">
                    {
                        project &&
                        <ListTasksComponent project={project} />
                    }
                </div>
            </div>


        </div>
    )
}