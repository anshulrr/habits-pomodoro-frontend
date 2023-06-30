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
                console.log(response)
                setPomodoros(response.data)
            })
            .catch(response => console.log(response))
    }

    function retrieveProjectCategories() {
        retrieveAllProjectCategoriesApi(10, 0)
            .then(response => {
                console.log(response)
                setCategories(response.data)
                setIncludeCategories(response.data.map(c => c.id))
            })
            .catch(response => console.log(response))
    }

    return (
        <div className="container">

            <div className="row">
                <div className="col-4">
                    <h5>Include Project Categories</h5>
                    <CategoryChecklistComponent
                        key={categories}
                        categories={categories}
                        setIncludeCategories={setIncludeCategories}
                    ></CategoryChecklistComponent>
                </div>
                <hr />
            </div>

            <div className="row">
                <div className="col-6">
                    {/* setting key for re-render */}
                    <TasksChart key={includeCategories} includeCategories={includeCategories} />
                </div>
                <div className="col-4 offset-1">
                    <ProjectsDistributionChart key={includeCategories} includeCategories={includeCategories} />
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <TotalChart key={includeCategories} includeCategories={includeCategories} />
                </div>
            </div>

            <br />

            <h3>Today's pomodoros</h3>
            <div>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Start Time</th>
                            <th>End Time</th>
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
            </div >

        </div >
    )
}