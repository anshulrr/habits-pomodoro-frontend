import { useEffect, useState } from "react"
import { retrieveAllProjectCategoriesApi } from "../services/api/ProjectCategoryApiService";
import moment from "moment"
import { TasksChart } from "./charts/TasksChart";
import { ProjectsDistributionChart } from "./charts/ProjectsDistributionChart";
import { TotalChart } from "./charts/TotalChart";
import CategoryChecklistComponent from "./CategoryChecklistComponent";
import ListPomodorosComponent from "./ListPomodorosComponent";

export default function ListTasksComponent() {

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

    const [listPomodorosButtonsStates, setListPomodorosButtonsStates] = useState({
        limit: 'daily',
        offset: 0,
        dateString: moment().format('DD MMM')
    })

    // for first time load
    useEffect(
        () => {
            // console.debug('re-render StatsComponent')
            retrieveProjectCategories()
        }, []   // eslint-disable-line react-hooks/exhaustive-deps
    )

    function retrieveProjectCategories() {
        retrieveAllProjectCategoriesApi(10, 0)
            .then(response => {
                // console.debug(response)
                setCategories(response.data)
                setIncludeCategories(response.data
                    .filter(c => c.statsDefault === true)
                    .map(c => c.id)
                )
            })
            .catch(error => console.error(error.message))
    }

    return (
        <div className="container">

            <div className="row">
                <div className="col-md-4">
                    <h6>Included Project Categories ({includeCategories.length})</h6>
                    <CategoryChecklistComponent
                        key={categories}
                        categories={categories}
                        setIncludeCategories={setIncludeCategories}
                    ></CategoryChecklistComponent>
                </div>
                {
                    includeCategories.length !== 0 &&
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-6">
                                <TasksChart
                                    key={includeCategories}
                                    includeCategories={includeCategories}
                                    buttonsStates={tasksChartButtonsStates}
                                    setButtonsStates={setTasksChartBButtonsStates}
                                />
                                <hr />
                            </div>
                            <div className="col-md-6">
                                <ProjectsDistributionChart
                                    key={includeCategories}
                                    includeCategories={includeCategories}
                                    buttonsStates={projectsChartButtonsStates}
                                    setButtonsStates={setProjectsChartBButtonsStates}
                                />
                                <hr />
                            </div>
                            <div className="col-md-6">
                                <TotalChart
                                    key={includeCategories}
                                    includeCategories={includeCategories}
                                    buttonsStates={totalChartButtonsStates}
                                    setButtonsStates={setTotalChartBButtonsStates}
                                />
                                <hr />
                            </div>
                            <div className="col-md-6 overflow-scroll" style={{ maxHeight: "55vh" }}>
                                <ListPomodorosComponent
                                    key={includeCategories}
                                    includeCategories={includeCategories}
                                    buttonsStates={listPomodorosButtonsStates}
                                    setButtonsStates={setListPomodorosButtonsStates}
                                />
                            </div >
                        </div>
                    </div>
                }

            </div >
        </div >
    )
}