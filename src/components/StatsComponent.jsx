import { useEffect, useState } from "react"
import { retrieveAllProjectCategoriesApi } from "../services/api/ProjectCategoryApiService";
import moment from "moment"
import { TasksChart } from "./charts/TasksChart";
import { ProjectsDistributionChart } from "./charts/ProjectsDistributionChart";
import { TotalChart } from "./charts/TotalChart";
import CategoryChecklistComponent from "./CategoryChecklistComponent";
import ListPomodorosComponent from "./ListPomodorosComponent";
import StatsSettingsComponent from "./StatsSettingsComponent";

export default function ListTasksComponent() {

    const [categories, setCategories] = useState([])

    const [includeCategories, setIncludeCategories] = useState([])

    const [statsSettings, setStatsSettings] = useState({})

    const [reload, setReload] = useState(0)

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
                        reload={reload}
                        setReload={setReload}
                    />

                    <h6>Settings</h6>
                    <StatsSettingsComponent
                        statsSettings={statsSettings}
                        setStatsSettings={setStatsSettings}
                        reload={reload}
                        setReload={setReload}
                    />
                </div>
                {
                    includeCategories.length !== 0 && Object.keys(statsSettings).length !== 0 &&
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-6">
                                <TasksChart
                                    key={reload}
                                    includeCategories={includeCategories}
                                    statsSettings={statsSettings}
                                    buttonsStates={tasksChartButtonsStates}
                                    setButtonsStates={setTasksChartBButtonsStates}
                                />
                                <hr />
                            </div>
                            <div className="col-md-6">
                                <ProjectsDistributionChart
                                    key={reload}
                                    includeCategories={includeCategories}
                                    statsSettings={statsSettings}
                                    buttonsStates={projectsChartButtonsStates}
                                    setButtonsStates={setProjectsChartBButtonsStates}
                                />
                                <hr />
                            </div>
                            <div className="col-md-6">
                                <TotalChart
                                    key={reload}
                                    includeCategories={includeCategories}
                                    statsSettings={statsSettings}
                                    buttonsStates={totalChartButtonsStates}
                                    setButtonsStates={setTotalChartBButtonsStates}
                                />
                                <hr />
                            </div>
                            <div className="col-md-6 overflow-scroll" style={{ maxHeight: "55vh" }}>
                                <ListPomodorosComponent
                                    key={reload}
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