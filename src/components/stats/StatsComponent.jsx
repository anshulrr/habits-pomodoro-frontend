import { useEffect, useState } from "react"

import moment from "moment"

import { retrieveAllProjectCategoriesApi } from "services/api/ProjectCategoryApiService";

import { TasksChart } from "components/stats/charts/TasksChart";
import { ProjectsDistributionChart } from "components/stats/charts/ProjectsDistributionChart";
import { TotalChart } from "components/stats/charts/TotalChart";
import ListPomodorosComponent from "components/stats/ListPomodorosComponent";

import CategoryChecklistComponent from "components/stats/CategoryChecklistComponent";
import StatsSettingsComponent from "components/stats/StatsSettingsComponent";

export default function ListTasksComponent() {

    const [categories, setCategories] = useState([])

    const [includeCategories, setIncludeCategories] = useState([])

    const [statsSettings, setStatsSettings] = useState({})

    const [showIncludeCategories, setShowIncludeCategories] = useState(false)
    const [showStatsSettings, setShowStatsSettings] = useState(false)

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
        <div className="container mt-3">

            <div className="row">
                <div className="col-md-4">
                    <div className="d-flex justify-content-between mb-2">
                        <h6 className="mb-0">
                            Included Project Categories
                            <span className="ms-1 badge rounded-pill text-bg-secondary">
                                {includeCategories.length}
                                <i className="ms-1 bi bi-link-45deg" />
                            </span>
                        </h6>
                        <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1" onClick={() => setShowIncludeCategories(!showIncludeCategories)}>
                            <i className="bi bi-pencil-square" />
                        </button>
                    </div>
                    <div style={{ display: showIncludeCategories ? "block" : "none" }} >
                        <CategoryChecklistComponent
                            key={categories}
                            categories={categories}
                            setIncludeCategories={setIncludeCategories}
                            reload={reload}
                            setReload={setReload}
                            setShowIncludeCategories={setShowIncludeCategories}
                        />
                    </div>

                    <div className="d-flex justify-content-between mb-2">
                        <h6 className="mb-0">
                            Settings
                        </h6>
                        <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1" onClick={() => setShowStatsSettings(!showStatsSettings)}>
                            <i className="bi bi-pencil-square" />
                        </button>
                    </div>
                    <div style={{ display: showStatsSettings ? "block" : "none" }} >
                        <StatsSettingsComponent
                            statsSettings={statsSettings}
                            setStatsSettings={setStatsSettings}
                            reload={reload}
                            setReload={setReload}
                            setShowStatsSettings={setShowStatsSettings}
                        />
                    </div>
                    <hr />
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
                            </div>
                            <div className="col-md-6">
                                <ProjectsDistributionChart
                                    key={reload}
                                    includeCategories={includeCategories}
                                    statsSettings={statsSettings}
                                    buttonsStates={projectsChartButtonsStates}
                                    setButtonsStates={setProjectsChartBButtonsStates}
                                />
                            </div>
                            <div className="col-md-6 mt-2">
                                <TotalChart
                                    key={reload}
                                    includeCategories={includeCategories}
                                    statsSettings={statsSettings}
                                    buttonsStates={totalChartButtonsStates}
                                    setButtonsStates={setTotalChartBButtonsStates}
                                />
                            </div>
                            <div className="col-md-6 mt-2">
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