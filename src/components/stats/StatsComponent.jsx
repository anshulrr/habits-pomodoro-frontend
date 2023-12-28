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
import { CalendarChart } from "./charts/CalendarChart";
import { ProjectCategoriesChart } from "./charts/ProjectCategoriesChart";
import OutsideAlerter from "services/hooks/OutsideAlerter";

export default function ListStatsComponent() {

    const [categories, setCategories] = useState([])

    const [includeCategories, setIncludeCategories] = useState([])

    const [statsSettings, setStatsSettings] = useState({})

    const [showIncludeCategories, setShowIncludeCategories] = useState(true);
    const [showStatsSettings, setShowStatsSettings] = useState(true);
    const [showFriendsStats, setShowFriendsStats] = useState(true);

    const [reload, setReload] = useState(0)
    const [reloadCategories, setReloadCategories] = useState(0)

    const [subject, setSubject] = useState(null)
    const [subjects, setSubjects] = useState([])

    const [showLoader, setShowLoader] = useState(true)

    const [showLeftMenu, setShowLeftMenu] = useState(window.innerWidth <= 992 ? false : true);

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

    const [subPage, setSubPage] = useState('')
    const [showAll, setShowAll] = useState(true)

    // for first time load
    useEffect(
        () => {
            // console.debug('re-render StatsComponent')
            document.title = 'Stats';
            retrieveProjectCategories();
            retrieveAccountabilitySubjects();
        }, []   // eslint-disable-line react-hooks/exhaustive-deps
    )


    useEffect(
        () => {
            setShowLeftMenu(false)
        }, [reload]
    )

    function retrieveProjectCategories(subject) {
        // TODO: better implementation for limit
        retrieveAllProjectCategoriesApi(100, 0, subject)
            .then(response => {
                // console.debug(response)
                setIncludeCategories(response.data
                    .filter(c => c.statsDefault === true)
                    .map(c => c.id)
                )
                setCategories(response.data)
                setReloadCategories(reloadCategories + 1);
                setReload(prev => prev + 1);
                setShowLoader(false)
            })
            .catch(error => console.error(error.message))
    }

    function retrieveAccountabilitySubjects() {
        retrieveAccountabilitySubjectsApi()
            .then(response => {
                setSubjects(response.data);
            })
    }

    return (
        <div className="container">

            {
                subject != null &&
                <div className="sticky-menu" style={{ backgroundColor: "unset" }}>
                    <div className="row px-0">
                        <div className="col-12 px-0">
                            <div className="alert alert-primary mb-0 py-1" role="alert">
                                {subject.email}
                            </div>
                        </div>
                    </div>
                </div>
            }
            <div className="row sub-menu" style={{ display: window.innerWidth <= 992 ? "block" : "none" }}>
                <div className="col-12">
                    <button type="button" className={"btn btn-sm btn-outline-secondary py-0 px-1 " + (showAll ? "active" : "")} onClick={() => setShowAll(true)}>
                        Show All
                    </button>
                    <button type="button" className={"btn btn-sm btn-outline-secondary py-0 px-1 " + (subPage === "total" && !showAll ? "active" : "")} onClick={() => { setSubPage("total"); setShowAll(false) }}>
                        Total
                    </button>
                    <button type="button" className={"btn btn-sm btn-outline-secondary py-0 px-1 " + (subPage === "projects" && !showAll ? "active" : "")} onClick={() => { setSubPage("projects"); setShowAll(false) }}>
                        Projects
                    </button>
                    <button type="button" className={"btn btn-sm btn-outline-secondary py-0 px-1 " + (subPage === "tasks" && !showAll ? "active" : "")} onClick={() => { setSubPage("tasks"); setShowAll(false) }}>
                        Tasks
                    </button>
                    <button type="button" className={"btn btn-sm btn-outline-secondary py-0 px-1 " + (subPage === "categories" && !showAll ? "active" : "")} onClick={() => { setSubPage("categories"); setShowAll(false) }}>
                        Project Categories
                    </button>
                    <button type="button" className={"btn btn-sm btn-outline-secondary py-0 px-1 " + (subPage === "streak" && !showAll ? "active" : "")} onClick={() => { setSubPage("streak"); setShowAll(false) }}>
                        Daily Streak
                    </button>
                    <button type="button" className={"btn btn-sm btn-outline-secondary py-0 px-1 " + (subPage === "pomodoros" && !showAll ? "active" : "")} onClick={() => { setSubPage("pomodoros"); setShowAll(false) }}>
                        Pomodoros List
                    </button>
                </div>
            </div>

            <span className="refresh-icon">
                <button type="button" className="btn btn-outline-secondary" onClick={() => setReload(prev => prev + 1)}>
                    <i className="bi bi-arrow-clockwise" />
                </button>
            </span>
            <div className="left-menu-icon">
                <button type="button" className="btn btn-secondary" onClick={() => setShowLeftMenu(!showLeftMenu)}>
                    Stats Filters <i className="bi bi-list" />
                </button>
            </div>

            <div className="row">
                <div className="col-lg-4 text-start">

                    <div className={showLeftMenu ? "left-menu-container" : ""}>
                        <div className={"left-menu-overlay " + (showLeftMenu ? "left-menu-enter" : "left-menu-exit")} >
                            <div id="outside-alerter-parent">
                                <OutsideAlerter handle={() => setShowLeftMenu(false)}>
                                    <div className="left-menu-popup">

                                        <div className="d-flex justify-content-between mt-3 mb-2"
                                            onClick={() => setShowStatsSettings(!showStatsSettings)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <h6 className="mb-0">
                                                Stats Settings
                                            </h6>
                                            <div className="text-secondary px-1" >
                                                {
                                                    !showStatsSettings &&
                                                    <i className="bi bi-eye-slash" />
                                                }
                                                {
                                                    showStatsSettings &&
                                                    <i className="bi bi-eye" />
                                                }
                                            </div>
                                        </div>
                                        <div style={{ display: showStatsSettings ? "block" : "none" }} >
                                            <StatsSettingsComponent
                                                statsSettings={statsSettings}
                                                setStatsSettings={setStatsSettings}
                                                reload={reload}
                                                setReload={setReload}
                                            />
                                        </div>

                                        <hr className="mb-3" />

                                        <div className="d-flex justify-content-between mb-2"
                                            onClick={() => setShowIncludeCategories(!showIncludeCategories)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <h6 className="mb-0">
                                                Included Project Categories
                                                <span className="ms-1 badge rounded-pill text-bg-secondary">
                                                    {includeCategories.length}/{categories.length}
                                                    <i className="ms-1 bi bi-link-45deg" />
                                                </span>
                                                {
                                                    showLoader &&
                                                    <span className="loader-container-2" >
                                                        <span className="ms-2 loader-2"></span>
                                                    </span>
                                                }
                                            </h6>
                                            <div className="text-secondary px-1">
                                                {
                                                    !showIncludeCategories &&
                                                    <i className="bi bi-eye-slash" />
                                                }
                                                {
                                                    showIncludeCategories &&
                                                    <i className="bi bi-eye" />
                                                }
                                            </div>
                                        </div>
                                        <div style={{ display: showIncludeCategories ? "block" : "none" }} >
                                            <CategoryChecklistComponent
                                                key={reloadCategories}
                                                categories={categories}
                                                setIncludeCategories={setIncludeCategories}
                                                setReload={setReload}
                                            />
                                        </div>

                                        <hr className="mb-3" />

                                        <div className="d-flex justify-content-between mb-2 alert alert-primary p-1"
                                            onClick={() => setShowFriendsStats(!showFriendsStats)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <div className="d-flex dustify-content-start my-auto">
                                                <h6 className="mb-0">
                                                    Mentees Stats
                                                </h6>
                                                <div className="ms-1 badge rounded-pill text-bg-secondary">
                                                    {subjects.length}
                                                    <i className="ps-1 bi bi-person-fill" />
                                                </div>
                                            </div>
                                            <div className="text-secondary px-1 my-auto">
                                                {
                                                    !showFriendsStats &&
                                                    <i className="bi bi-eye-slash" />
                                                }
                                                {
                                                    showFriendsStats &&
                                                    <i className="bi bi-eye" />
                                                }
                                            </div>
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
                                </OutsideAlerter>
                            </div>
                        </div>
                    </div>

                </div>

                {
                    !(includeCategories.length !== 0 && Object.keys(statsSettings).length !== 0) &&
                    <span className="loader-container mt-5">
                        <span className="loader"></span>
                    </span>
                }
                {
                    includeCategories.length !== 0 && Object.keys(statsSettings).length !== 0 &&
                    <div className="col-lg-8">
                        <div className="row">
                            <div className="col-lg-6 px-0" style={{ display: subPage === "total" || showAll ? "block" : "none" }}>
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
                            <div className="col-lg-6 px-0" style={{ display: subPage === "projects" || showAll ? "block" : "none" }}>
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
                            <div className="col-lg-6 px-0" style={{ display: subPage === "tasks" || showAll ? "block" : "none" }}>
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
                            <div className="col-lg-6 px-0" style={{ display: subPage === "categories" || showAll ? "block" : "none" }}>
                                <div className="p-1 chart-card">
                                    <ProjectCategoriesChart
                                        key={reload}
                                        includeCategories={includeCategories}
                                        subject={subject}
                                        statsSettings={statsSettings}
                                        buttonsStates={projectsChartButtonsStates}
                                        setButtonsStates={setProjectsChartBButtonsStates}
                                    />
                                </div>
                            </div>
                            <div className="col-lg-12 px-0" style={{ display: subPage === "streak" || showAll ? "block" : "none" }}>
                                <div className="py-1 px-3 chart-card">
                                    <CalendarChart
                                        key={reload}
                                        includeCategories={includeCategories}
                                        categories={categories}
                                        subject={subject}
                                    />
                                </div>
                            </div >
                            <div className="col-lg-6 px-0" style={{ display: subPage === "pomodoros" || showAll ? "block" : "none" }}>
                                <div className="p-1 chart-card" style={{ height: "70vh", overflowY: "scroll" }}>
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