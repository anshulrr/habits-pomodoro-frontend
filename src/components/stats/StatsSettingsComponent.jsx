import { useEffect, useState } from 'react'

import { useAuth } from 'services/auth/AuthContext';

export default function StatsSettingsComponent({ setStatsSettings, setReload }) {

    const authContext = useAuth();
    const userSettings = authContext.userSettings;

    const [enableChartScale, setEnableChartScale] = useState(userSettings.enableChartScale)
    const [chartScale, setChartScale] = useState(userSettings.chartScale)
    const [enableChartWeeklyAverage, setEnableChartWeeklyAverage] = useState(userSettings.enableChartWeeklyAverage)
    const [chartWeeklyAverage, setChartWeeklyAverage] = useState(userSettings.chartWeeklyAverage)
    const [enableChartMonthlyAverage, setEnableChartMonthlyAverage] = useState(userSettings.enableChartMonthlyAverage)
    const [chartMonthlyAverage, setChartMonthlyAverage] = useState(userSettings.chartMonthlyAverage)
    const [enableChartYearlyAverage, setEnableChartYearlyAverage] = useState(userSettings.enableChartYearlyAverage)
    const [chartYearlyAverage, setChartYearlyAverage] = useState(userSettings.chartYearlyAverage)
    const [enableChartAdjustedWeeklyMonthlyAverage, setEnableChartAdjustedWeeklyMonthlyAverage] = useState(userSettings.enableChartAdjustedWeeklyMonthlyAverage)
    const [tasksChartType, setTasksChartType] = useState(userSettings.tasksChartType || "doughnut")
    const [projectsChartType, setProjectsChartType] = useState(userSettings.projectsChartType || "bar")
    const [projectCategoriesChartType, setProjectCategoriesChartType] = useState(userSettings.projectCategoriesChartType || "bar")

    const [errorMessage, setErrorMessage] = useState('')

    useEffect(
        () => {
            updateSettings()
        }, []   // eslint-disable-line react-hooks/exhaustive-deps
    )

    function updateSettings() {
        // validate input
        if (!isValidated()) {
            return;
        }

        const updatedStatsSetting = {
            enableChartScale,
            chartScale,
            enableChartWeeklyAverage,
            chartWeeklyAverage,
            enableChartMonthlyAverage,
            chartMonthlyAverage,
            enableChartYearlyAverage,
            chartYearlyAverage,
            enableChartAdjustedWeeklyMonthlyAverage,
            tasksChartType,
            projectsChartType,
            projectCategoriesChartType
        };
        // console.debug(updatedStatsSetting)
        setStatsSettings(updatedStatsSetting)

        // to reload chart components
        setReload(prevReload => prevReload + 1)

        setErrorMessage('')
    }

    function handleOnChange(fun, val) {
        fun(val)
        setErrorMessage("Click on Fetch to view Stats with updated Settings")
    }

    function isValidated() {
        // console.debug(pomodoroLength)
        if (chartScale === '' || chartScale < 1) {
            setErrorMessage('Chart Scale must be greater than 0');
        }
        else if (chartYearlyAverage === '' || chartYearlyAverage < 1) {
            setErrorMessage('Chart Yearly Average must be greater than 0');
        }
        else if (chartMonthlyAverage === '' || chartMonthlyAverage < 1) {
            setErrorMessage('Chart Monthly Average must be greater than 0');
        } else {
            return true;
        }
        return false;
    }

    return (
        <div className="row">

            <div className="col-lg-12 mt-2">
                <div className="input-group input-group-sm mb-2">
                    <div className="input-group-text">
                        <input
                            type="checkbox"
                            name="enableChartScale"
                            className="form-check-input mt-0"
                            checked={enableChartScale}
                            onChange={(e) => handleOnChange(setEnableChartScale, e.target.checked)}
                            id="eChartScale"
                        />
                    </div>
                    <label className="input-group-text" htmlFor="eChartScale">
                        Enable Scale (mins)
                    </label>
                    <input
                        type="number"
                        name="chartScale"
                        className="form-control"
                        value={chartScale}
                        min={1}
                        placeholder="Chart Scale"
                        onChange={(e) => handleOnChange(setChartScale, e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="col-lg-12">
                <div className="input-group input-group-sm mb-2">
                    <div className="input-group-text">
                        <input
                            type="checkbox"
                            name="enableChartWeeklyAverage"
                            className="form-check-input mt-0"
                            checked={enableChartWeeklyAverage}
                            onChange={(e) => handleOnChange(setEnableChartWeeklyAverage, e.target.checked)}
                            id="eChartWeeklyAverage"
                        />
                    </div>
                    <label className="input-group-text" htmlFor="eChartWeeklyAverage">
                        Enable Weekly Avg (days)
                    </label>
                    <input
                        type="number"
                        name="chartWeeklyAverage"
                        className="form-control"
                        value={chartWeeklyAverage}
                        min={1}
                        placeholder="Chart Weekly Average"
                        onChange={(e) => handleOnChange(setChartWeeklyAverage, e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="col-lg-12">
                <div className="input-group input-group-sm mb-2">
                    <div className="input-group-text">
                        <input
                            type="checkbox"
                            name="enableChartMonthlyAverage"
                            className="form-check-input mt-0"
                            checked={enableChartMonthlyAverage}
                            onChange={(e) => handleOnChange(setEnableChartMonthlyAverage, e.target.checked)}
                            id="eChartMonthlyAverage"
                        />
                    </div>
                    <label className="input-group-text" htmlFor="eChartMonthlyAverage">
                        Enable Monthly Avg (days)
                    </label>
                    <input
                        type="number"
                        name="chartMonthlyAverage"
                        className="form-control"
                        value={chartMonthlyAverage}
                        min={1}
                        placeholder="Chart Monthly Average"
                        onChange={(e) => handleOnChange(setChartMonthlyAverage, e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="col-lg-12">
                <div className="input-group input-group-sm mb-2">
                    <div className="input-group-text">
                        <input
                            type="checkbox"
                            name="enableChartYearlyAverage"
                            className="form-check-input mt-0"
                            checked={enableChartYearlyAverage}
                            onChange={(e) => handleOnChange(setEnableChartYearlyAverage, e.target.checked)}
                            id="eChartYearlyAverage"
                        />
                    </div>
                    <label className="input-group-text" htmlFor="eChartYearlyAverage">
                        Enable Yearly Avg (days)
                    </label>
                    <input
                        type="number"
                        name="chartYearlyAverage"
                        className="form-control"
                        value={chartYearlyAverage}
                        min={1}
                        placeholder="Chart Yearly Average"
                        onChange={(e) => handleOnChange(setChartYearlyAverage, e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="col-lg-12">
                <div className="input-group input-group-sm mb-2">
                    <div className="input-group-text">
                        <input
                            type="checkbox"
                            name="enableChartAdjustedWeeklyMonthlyAverage"
                            className="form-check-input mt-0"
                            checked={enableChartAdjustedWeeklyMonthlyAverage}
                            onChange={(e) => handleOnChange(setEnableChartAdjustedWeeklyMonthlyAverage, e.target.checked)}
                            id="eChartAdjustedWeeklyMonthlyAverage"
                        />
                    </div>
                    <label className="input-group-text" htmlFor="eChartAdjustedWeeklyMonthlyAverage">
                        Enable Adjusted Avg for current W/M/Y
                    </label>
                </div>
            </div>

            <div className="col-lg-12">
                <div className="input-group input-group-sm mb-2">
                    <label className="input-group-text" htmlFor="projectCategoriesChartType">
                        Project Categories Chart Type
                    </label>
                    <select
                        className="form-select form-select-sm"
                        name="project-categories-chart-type"
                        onChange={(e) => handleOnChange(setProjectCategoriesChartType, e.target.value)}
                        value={projectCategoriesChartType}
                        id="projectCategoriesChartType"
                    >
                        <option value="bar">Bar</option>
                        <option value="doughnut">Doughnut</option>
                    </select>
                </div>
            </div>

            <div className="col-lg-12">
                <div className="input-group input-group-sm mb-2">
                    <label className="input-group-text" htmlFor="projectsChartType">
                        Projects Chart Type
                    </label>
                    <select
                        className="form-select form-select-sm"
                        name="projects-chart-type"
                        onChange={(e) => handleOnChange(setProjectsChartType, e.target.value)}
                        value={projectsChartType}
                        id="projectsChartType"
                    >
                        <option value="bar">Bar</option>
                        <option value="doughnut">Doughnut</option>
                    </select>
                </div>
            </div>

            <div className="col-lg-12">
                <div className="input-group input-group-sm mb-2">
                    <label className="input-group-text" htmlFor="tasksChartType">
                        Tasks Chart Type
                    </label>
                    <select
                        className="form-select form-select-sm"
                        name="tasks-chart-type"
                        onChange={(e) => handleOnChange(setTasksChartType, e.target.value)}
                        value={tasksChartType}
                        id="tasksChartType"
                    >
                        <option value="bar">Bar</option>
                        <option value="doughnut">Doughnut</option>
                    </select>
                </div>
            </div>


            <div className="col-lg-12">
                {errorMessage && <div className="alert alert-info mb-2 py-0 px-2 text-center"><small>{errorMessage}</small></div>}
                <div className="text-end">
                    <button className="btn btn-sm btn-outline-success" type="button" onClick={updateSettings}>Fetch</button>
                </div>
            </div>

        </div >
    )
}