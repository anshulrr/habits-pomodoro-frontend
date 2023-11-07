import { useEffect, useState } from "react"

import moment from "moment"

import { retrieveAllProjectCategoriesApi } from "services/api/ProjectCategoryApiService";
import { retrieveAccountabilitySubjectsApi } from "services/api/AccountabilityPartnerApiService";

import { TasksChart } from "components/stats/charts/TasksChart";
import { ProjectsDistributionChart } from "components/stats/charts/ProjectsDistributionChart";
import { TotalChart } from "components/stats/charts/TotalChart";
import ListPomodorosComponent from "components/stats/ListPomodorosComponent";

import CategoryChecklistComponent from "components/stats/CategoryChecklistComponent";
import StatsSettingsComponent from "components/stats/StatsSettingsComponent";
import SelectFriendsComponent from "components/stats//SelectFriendsComponent";

export default function ListStatsComponent() {

    const [categories, setCategories] = useState([])

    const [includeCategories, setIncludeCategories] = useState([])

    const [statsSettings, setStatsSettings] = useState({})

    const [showIncludeCategories, setShowIncludeCategories] = useState(false)
    const [showStatsSettings, setShowStatsSettings] = useState(false)
    const [showFriendsStats, setShowFriendsStats] = useState(false)

    const [reload, setReload] = useState(0)

    const [subject, setSubject] = useState(null)
    const [subjects, setSubjects] = useState([])

    const [pomodorosHeight, setPomodorosHeight] = useState(0);

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
            document.title = 'Stats';
            retrieveProjectCategories();
            retrieveAccountibilitySubjects();
        }, []   // eslint-disable-line react-hooks/exhaustive-deps
    )

    function retrieveProjectCategories(subject) {
        retrieveAllProjectCategoriesApi(10, 0, subject)
            .then(response => {
                // console.debug(response)
                setCategories(response.data)
                setIncludeCategories(response.data
                    .filter(c => c.statsDefault === true)
                    .map(c => c.id)
                )
                setReload(prev => prev + 1);
            })
            .catch(error => console.error(error.message))
    }

    function retrieveAccountibilitySubjects() {
        retrieveAccountabilitySubjectsApi()
            .then(response => {
                setSubjects(response.data);
            })
    }

    return (
        <div className="container mt-3">

            <div className="row">
                {
                    subject != null &&
                    <div className="alert alert-primary" role="alert">
                        {subject.email}
                    </div>
                }
                <div className="col-lg-4">
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

                    <div className="d-flex justify-content-between mb-2">
                        <h6 className="mb-0">
                            Friends Stats
                            <span className="ms-1 badge rounded-pill text-bg-secondary">
                                <i className="bi bi-person-fill" />
                            </span>
                        </h6>
                        <button type="button" className="btn btn-sm btn-outline-secondary py-0 px-1" onClick={() => setShowFriendsStats(!showFriendsStats)}>
                            <i className="bi bi-pencil-square" />
                        </button>
                    </div>

                    <div style={{ display: showFriendsStats ? "block" : "none" }} >
                        <SelectFriendsComponent
                            subjects={subjects}
                            setSubject={setSubject}
                            retrieveProjectCategories={retrieveProjectCategories}
                            setShowFriendsStats={setShowFriendsStats}
                        />
                    </div>
                </div>

                {
                    includeCategories.length !== 0 && Object.keys(statsSettings).length !== 0 &&
                    <div className="col-lg-8">
                        <div className="row">
                            <div className="col-lg-6 px-0">
                                <div className="p-1 chart-card">
                                    <TasksChart
                                        key={reload}
                                        includeCategories={includeCategories}
                                        subject={subject}
                                        statsSettings={statsSettings}
                                        buttonsStates={tasksChartButtonsStates}
                                        setButtonsStates={setTasksChartBButtonsStates}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6 px-0">
                                <div className="p-1 chart-card">
                                    <ProjectsDistributionChart
                                        key={reload}
                                        includeCategories={includeCategories}
                                        subject={subject}
                                        statsSettings={statsSettings}
                                        buttonsStates={projectsChartButtonsStates}
                                        setButtonsStates={setProjectsChartBButtonsStates}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6 px-0">
                                <div className="p-1 chart-card">
                                    <TotalChart
                                        key={reload}
                                        includeCategories={includeCategories}
                                        subject={subject}
                                        statsSettings={statsSettings}
                                        buttonsStates={totalChartButtonsStates}
                                        setButtonsStates={setTotalChartBButtonsStates}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-6 px-0">
                                <div className="p-1 mb-5 chart-card">
                                    <ListPomodorosComponent
                                        key={reload}
                                        includeCategories={includeCategories}
                                        subject={subject}
                                        buttonsStates={listPomodorosButtonsStates}
                                        setButtonsStates={setListPomodorosButtonsStates}
                                        elementHeight={pomodorosHeight}
                                        setElementHeight={setPomodorosHeight}
                                    />
                                </div>
                            </div >
                        </div>
                    </div>
                }

            </div >
        </div >
    )
}