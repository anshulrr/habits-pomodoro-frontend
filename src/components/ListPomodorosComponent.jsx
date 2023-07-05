import { useEffect, useState } from "react"
import { getPomodorosApi } from "../services/api/PomodoroApiService";
import { retrieveAllProjectCategoriesApi } from "../services/api/ProjectCategoryApiService";
import moment from "moment"
import { TasksChart } from "./charts/TasksChart";
import { ProjectsDistributionChart } from "./charts/ProjectsDistributionChart";
import { TotalChart } from "./charts/TotalChart";
import CategoryChecklistComponent from "./CategoryChecklistComponent";

export default function ListTasksComponent() {

    const [pomodoros, setPomodoros] = useState([])

    const [categories, setCategories] = useState([])

    const [includeCategories, setIncludeCategories] = useState([])

    const [tasksChartButtonsStates, setTasksChartBButtonsStates] = useState({
        limit: 'daily',
        offset: 0,
        dateString: moment().format('DD MMM')
    })

    const [projectsChartButtonsStates, setProjectsChartBButtonsStates] = useState({
        limit: 'daily',
        offset: 0,
        dateString: moment().format('DD MMM')
    })

    const [totalChartButtonsStates, setTotalChartBButtonsStates] = useState({
        limit: 'daily',
        offset: 0,
        dateString: ''
    })

    // for first time load
    useEffect(
        () => {
            retrieveTodayPomodoros()
            retrieveProjectCategories()
        },
        []
    )

    function retrieveTodayPomodoros() {
        getPomodorosApi()
            .then(response => {
                // console.log(response)
                setPomodoros(response.data)
            })
            .catch(response => console.log(response))
    }

    function retrieveProjectCategories() {
        retrieveAllProjectCategoriesApi(10, 0)
            .then(response => {
                // console.log(response)
                setCategories(response.data)
                setIncludeCategories(response.data.map(c => c.id))
            })
            .catch(response => console.log(response))
    }

    return (
        <div className="container">

            <div className="row">
                <div className="col-sm-4">
                    <h6>Included Project Categories</h6>
                    <CategoryChecklistComponent
                        key={categories}
                        categories={categories}
                        setIncludeCategories={setIncludeCategories}
                    ></CategoryChecklistComponent>
                </div>
                <div className="col-sm-4">
                    {/* setting key for re-render */}
                    <TasksChart
                        key={includeCategories}
                        includeCategories={includeCategories}
                        buttonsStates={tasksChartButtonsStates}
                        setButtonsStates={setTasksChartBButtonsStates}
                    />
                    <hr />
                </div>
                <div className="col-sm-4">
                    <ProjectsDistributionChart
                        key={includeCategories}
                        includeCategories={includeCategories}
                        buttonsStates={projectsChartButtonsStates}
                        setButtonsStates={setProjectsChartBButtonsStates}
                    />
                    <hr />
                </div>
            </div>

            <div className="row">

                <div className="col-sm-4 offset-sm-4">
                    <TotalChart
                        key={includeCategories}
                        includeCategories={includeCategories}
                        buttonsStates={totalChartButtonsStates}
                        setButtonsStates={setTotalChartBButtonsStates}
                    />
                    <hr />
                </div>
                <div className="col-sm-4">
                    <h6>Today's pomodoros</h6>
                    <small>
                        <table className="table table-sm table-striped">
                            <thead>
                                <tr>
                                    <th>Start</th>
                                    <th>End</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    pomodoros.map(
                                        pomodoro => (
                                            <tr key={pomodoro.id}>
                                                <td>
                                                    {moment.utc(pomodoro.startTime).local().format('H:mm')}
                                                </td>
                                                <td>
                                                    {moment.utc(pomodoro.endTime).local().format('H:mm')}
                                                </td>
                                            </tr>
                                        )
                                    )
                                }
                            </tbody>
                        </table>
                    </small>
                </div >
            </div >
        </div >
    )
}