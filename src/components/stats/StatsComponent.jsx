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
import SelectFriendsComponent from "components/stats/SelectFriendsComponent";
import { StreakChart } from "components/stats/charts/StreakChart";
import { ProjectCategoriesChart } from "components/stats/charts/ProjectCategoriesChart";
import OutsideAlerter from "services/hooks/OutsideAlerter";
import FooterComponent from "components/FooterComponent";
import { getRunningPomodoroApi } from "services/api/PomodoroApiService";

export default function ListStatsComponent() {

    const [categories, setCategories] = useState([])

    const [includeCategories, setIncludeCategories] = useState([])

    const [statsSettings, setStatsSettings] = useState({})

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

    const [streakButtonsStates, setStreakButtonsStates] = useState({
        startDate: moment().startOf('year').toISOString(),
        endDate: moment().endOf('year').toISOString(),
        limit: 'yearly',
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
            getRunningPomodoroApi();    // update running pomodoro data on page reload
            retrieveProjectCategories();
            retrieveAccountabilitySubjects();
        }, []   // eslint-disable-line react-hooks/exhaustive-deps
    )


    useEffect(
        () => {
            setShowLeftMenu(false);
            // update running pomodoro data: 
            // NOTE: will reflect in stats only in second reload
            // TODO: find better solution
            getRunningPomodoroApi();
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
                <div className="sticky-menu pb-0" style={{ backgroundColor: "unset" }}>
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


            <div className="row">
                <div className="col-lg-4 px-0 text-start">

                    <div className={showLeftMenu ? "left-menu-container" : ""}>
                        <div className={"left-menu-overlay " + (showLeftMenu ? "left-menu-enter" : "left-menu-exit")} >
                            <div id="outside-alerter-parent">
                                <OutsideAlerter handle={() => setShowLeftMenu(false)}>
                                    <div className="left-menu-popup">

                                        <div className="container mt-1 py-2 border-bottom">
                                            <div className="d-flex justify-content-between">
                                                <h6 className="mb-0">
                                                    Stats Settings
                                                </h6>
                                            </div>
                                            <div className="">
                                                <StatsSettingsComponent
                                                    statsSettings={statsSettings}
                                                    setStatsSettings={setStatsSettings}
                                                    reload={reload}
                                                    setReload={setReload}
                                                />
                                            </div>
                                        </div>

                                        <div className="container py-2 border-bottom">

                                            <div className="d-flex justify-content-between">
                                                <h6 className="mb-0">
                                                    Included Project Categories
                                                    {
                                                        categories.length !== 0 &&
                                                        <span className="ms-1 badge rounded-pill text-bg-secondary">
                                                            {includeCategories.length}/{categories.length}
                                                            <i className="ms-1 bi bi-link-45deg" />
                                                        </span>
                                                    }
                                                    {
                                                        showLoader &&
                                                        <span className="loader-container-2" >
                                                            <span className="ms-2 loader-2"></span>
                                                        </span>
                                                    }
                                                </h6>
                                            </div>
                                            <div>
                                                <CategoryChecklistComponent
                                                    key={reloadCategories}
                                                    categories={categories}
                                                    setIncludeCategories={setIncludeCategories}
                                                    setReload={setReload}
                                                />
                                            </div>
                                        </div>


                                        <div className="container py-2 border-bottom" style={{ backgroundColor: "rgb(207, 226, 255)" }}>

                                            <div className="d-flex justify-content-between">
                                                <div className="d-flex dustify-content-start my-auto">
                                                    <h6 className="mb-0">
                                                        Mentees Stats
                                                    </h6>
                                                    {
                                                        subjects.length !== 0 &&
                                                        <div className="ms-1 badge rounded-pill text-bg-secondary">
                                                            {subjects.length}
                                                            <i className="ps-1 bi bi-person-fill" />
                                                        </div>
                                                    }
                                                </div>
                                            </div>

                                            <div>
                                                <SelectFriendsComponent
                                                    subjects={subjects}
                                                    setSubject={setSubject}
                                                    retrieveProjectCategories={retrieveProjectCategories}
                                                />
                                            </div>
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
                                    <StreakChart
                                        key={reload}
                                        includeCategories={includeCategories}
                                        categories={categories}
                                        subject={subject}
                                        buttonsStates={streakButtonsStates}
                                        setButtonsStates={setStreakButtonsStates}
                                    />
                                </div>
                            </div >
                            <div className="col-lg-6 px-0 mb-3" style={{ display: subPage === "pomodoros" || showAll ? "block" : "none" }}>
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

            <FooterComponent
                setShowLeftMenu={setShowLeftMenu}
                setReload={setReload}
                title={"Stats Filters"}
                isEmpty={false}
            />

        </div >
    )
}