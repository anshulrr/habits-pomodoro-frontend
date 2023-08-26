import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';

import { putUserSettingsApi } from 'services/api/AuthApiService'
import { useAuth } from 'services/auth/AuthContext';

export default function UserSettingsComponent() {

    const navigate = useNavigate()
    const { state } = useLocation();

    const authContext = useAuth();

    const [enableChartScale, setEnableChartScale] = useState('')
    const [chartScale, setChartScale] = useState('')
    const [enableChartWeeklyAverage, setEnableChartWeeklyAverage] = useState('')
    const [chartWeeklyAverage, setChartWeeklyAverage] = useState('')
    const [enableChartMonthlyAverage, setEnableChartMonthlyAverage] = useState('')
    const [chartMonthlyAverage, setChartMonthlyAverage] = useState('')
    const [enableChartAdjustedWeeklyMonthlyAverage, setEnableChartAdjustedWeeklyMonthlyAverage] = useState('')
    const [pomodoroLength, setPomodoroLength] = useState('')
    const [breakLength, setBreakLength] = useState('')
    const [enableStopwatch, setEnableStopwatch] = useState('')
    const [enableStopwatchAudio, setEnableStopwatchAudio] = useState('')
    const [pageProjectsCount, setPageProjectsCount] = useState('')
    const [pageTasksCount, setPageTasksCount] = useState('')
    const [pageCommentsCount, setPageCommentsCount] = useState('')
    const [tasksChartType, setTasksChartType] = useState('')
    const [projectsChartType, setProjectsChartType] = useState('')

    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    useEffect(() => {
        const fetchAndSetSettings = async () => {
            // get updated userSettings
            const userSettings = await authContext.getUserSettings();

            setEnableChartScale(userSettings.enableChartScale)
            setChartScale(userSettings.chartScale)
            setEnableChartWeeklyAverage(userSettings.enableChartWeeklyAverage)
            setChartWeeklyAverage(userSettings.chartWeeklyAverage)
            setEnableChartMonthlyAverage(userSettings.enableChartMonthlyAverage)
            setChartMonthlyAverage(userSettings.chartMonthlyAverage)
            setEnableChartAdjustedWeeklyMonthlyAverage(userSettings.enableChartAdjustedWeeklyMonthlyAverage)
            setPomodoroLength(userSettings.pomodoroLength)
            setBreakLength(userSettings.breakLength)
            setEnableStopwatch(userSettings.enableStopwatch)
            setEnableStopwatchAudio(userSettings.enableStopwatchAudio)
            setPageProjectsCount(userSettings.pageProjectsCount)
            setPageTasksCount(userSettings.pageTasksCount)
            setPageCommentsCount(userSettings.pageCommentsCount)
            setTasksChartType(userSettings.tasksChartType || "doughnut")
            setProjectsChartType(userSettings.projectsChartType || "bar")
        }

        fetchAndSetSettings();

    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    function saveSettings() {
        setErrorMessage('')
        setSuccessMessage('')

        // validate input
        if (!isValidated()) {
            return;
        }

        const request_settings = {
            enableChartScale,
            chartScale,
            enableChartWeeklyAverage,
            chartWeeklyAverage,
            enableChartMonthlyAverage,
            chartMonthlyAverage,
            enableChartAdjustedWeeklyMonthlyAverage,
            pomodoroLength,
            breakLength,
            enableStopwatch,
            enableStopwatchAudio,
            pageProjectsCount,
            pageTasksCount,
            pageCommentsCount,
            tasksChartType,
            projectsChartType
        }
        // console.debug(request_settings);

        putUserSettingsApi(request_settings)
            .then(response => {
                // console.debug(response);
                // update settings in auth context
                authContext.updateUserSettings(response.data)
                setSuccessMessage("Settings saved successfully")
                setTimeout(() => {
                    setSuccessMessage('')
                }, 1000 * 5)
                updateAppStates()
            })
            .catch(error => {
                console.error(error.message)
                setErrorMessage(error.message)
                setSuccessMessage('')
            })

    }

    function updateAppStates() {
        if (!state) {
            return;
        }
        state.currentProjectsPage = 1
        state.currentTasksPage = 1;
        state.currentCompletedTasksPage = 1;
        state.currentArchivedTasksPage = 1;
        // for page refresh: set it right away
        navigate(`/settings`, { state, replace: true });
    }

    function isValidated() {
        // console.debug(pomodoroLength)
        if (chartScale === '' || chartScale < 1) {
            setErrorMessage('Chart Scale must be greater than 0');
        }
        else if (chartWeeklyAverage === '' || chartWeeklyAverage < 1) {
            setErrorMessage('Chart Weekly Average must be greater than 0');
        }
        else if (chartMonthlyAverage === '' || chartMonthlyAverage < 1) {
            setErrorMessage('Chart Monthly Average must be greater than 0');
        }
        else if (pomodoroLength === '' || pomodoroLength < 1) {
            setErrorMessage('Pomodoro Length must be greater than 0');
        }
        else if (breakLength === '' || breakLength < 0) {
            setErrorMessage('Break Length must be greater than or equal to 0');
        }
        else if (pageProjectsCount === '' || pageProjectsCount < 1) {
            setErrorMessage('Number of Projects in a page must be greater than 0');
        }
        else if (pageTasksCount === '' || pageTasksCount < 1) {
            setErrorMessage('Number of Tasks in a page must be greater than 0');
        }
        else if (pageCommentsCount === '' || pageCommentsCount < 1) {
            setErrorMessage('Number of Tasks in a page must be greater than 0');
        } else {
            return true;
        }
        return false;
    }

    function handleOnChange(fun, val) {
        fun(val)
        setErrorMessage("Click on Save to update settings")
        setSuccessMessage('')
    }

    return (
        <div>
            <h6 className='text-start'>Stats Settings</h6>

            <div className="row">

                <div className="col-md-4">
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
                            Enable Chart Scale
                        </label>
                        <input
                            type="number"
                            name="chartScale"
                            className="form-control"
                            value={chartScale}
                            min={1}
                            placeholder="Chart Scale"
                            onChange={(e) => handleOnChange(setChartScale, e.target.value)}
                        />
                    </div>
                </div>

                <div className="col-md-4">
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
                            Enable Chart Weekly Average
                        </label>
                        <input
                            type="number"
                            name="chartWeeklyAverage"
                            className="form-control"
                            value={chartWeeklyAverage}
                            min={1}
                            placeholder="Chart Weekly Average"
                            onChange={(e) => handleOnChange(setChartWeeklyAverage, e.target.value)}
                        />
                    </div>
                </div>

                <div className="col-md-4">
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
                            Enable Chart Monthly Average
                        </label>
                        <input
                            type="number"
                            name="chartMonthlyAverage"
                            className="form-control"
                            value={chartMonthlyAverage}
                            min={1}
                            placeholder="Chart Monthly Average"
                            onChange={(e) => handleOnChange(setChartMonthlyAverage, e.target.value)}
                        />
                    </div>
                </div>

                <div className="col-md-12">
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
                            Enable Adjusted Avg for current W/M
                        </label>
                    </div>
                </div>

            </div>

            <h6 className='text-start'>General Settings</h6>

            <div className="row">
                <div className="col-md-4">
                    <div className="input-group input-group-sm mb-2">
                        <div className="input-group-text">
                            <input
                                type="checkbox"
                                name="enableStopwatch"
                                className="form-check-input mt-0"
                                checked={enableStopwatch}
                                onChange={(e) => handleOnChange(setEnableStopwatch, e.target.checked)}
                                id="eStopwatch"
                            />
                        </div>
                        <label className="input-group-text" htmlFor="eStopwatch">
                            Enable Stopwatch after a break
                        </label>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="input-group input-group-sm mb-2">
                        <div className="input-group-text">
                            <input
                                type="checkbox"
                                name="enableStopwatchAudio"
                                className="form-check-input mt-0"
                                checked={enableStopwatchAudio}
                                onChange={(e) => handleOnChange(setEnableStopwatchAudio, e.target.checked)}
                                id="eStopwatchAudio"
                            />
                        </div>
                        <label className="input-group-text" htmlFor="eStopwatchAudio">
                            Enable Stopwatch Audio after a break
                        </label>
                    </div>
                </div>
            </div>

            <div className="row">

                <div className="col-md-4">
                    <div className="input-group input-group-sm mb-2">
                        <label className="input-group-text" htmlFor="pomodoroLength">
                            Default Pomodoro Length
                        </label>
                        <input
                            type="number"
                            name="pomodoroLength"
                            className="form-control"
                            value={pomodoroLength}
                            min={1}
                            placeholder="Default Pomodoro Length"
                            onChange={(e) => handleOnChange(setPomodoroLength, e.target.value)}
                            id="pomodoroLength"
                        />
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="input-group input-group-sm mb-2">
                        <label className="input-group-text" htmlFor="breakLength">
                            Break Length
                        </label>
                        <input
                            type="number"
                            name="breakLength"
                            className="form-control"
                            value={breakLength}
                            min={0}
                            placeholder="Default Break Length"
                            onChange={(e) => handleOnChange(setBreakLength, e.target.value)}
                            id="breakLength"
                        />
                    </div>
                </div>

            </div>

            <h6 className='text-start'>Display Settings</h6>

            <div className="row">

                <div className="col-md-4">
                    <div className="input-group input-group-sm mb-2">
                        <label className="input-group-text" htmlFor="breakLength">
                            Number of projects in a page (mobile device)
                        </label>
                        <input
                            type="number"
                            name="pageProjectsCount"
                            className="form-control"
                            value={pageProjectsCount}
                            min={0}
                            placeholder="Default Number of Projects"
                            onChange={(e) => handleOnChange(setPageProjectsCount, e.target.value)}
                            id="pageProjectsCount"
                        />
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="input-group input-group-sm mb-2">
                        <label className="input-group-text" htmlFor="breakLength">
                            Number of tasks in a page (mobile device)
                        </label>
                        <input
                            type="number"
                            name="pageTasksCount"
                            className="form-control"
                            value={pageTasksCount}
                            min={0}
                            placeholder="Default Number of Tasks"
                            onChange={(e) => handleOnChange(setPageTasksCount, e.target.value)}
                            id="pageTasksCount"
                        />
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="input-group input-group-sm mb-2">
                        <label className="input-group-text" htmlFor="breakLength">
                            Number of comments in a page
                        </label>
                        <input
                            type="number"
                            name="pageCommentsCount"
                            className="form-control"
                            value={pageCommentsCount}
                            min={0}
                            placeholder="Default Number of Comments"
                            onChange={(e) => handleOnChange(setPageCommentsCount, e.target.value)}
                            id="pageCommentsCount"
                        />
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="input-group input-group-sm mb-2">
                        <label className="input-group-text" htmlFor="tasksChartType">
                            Tasks Chart Type
                        </label>
                        <div className="input-group-text p-0">
                            <select
                                className="form-select form-select-sm"
                                name="tasks-chart-type"
                                onChange={(e) => handleOnChange(setTasksChartType, e.target.value)}
                                defaultValue={tasksChartType}
                                id="tasksChartType"
                            >
                                <option value="bar">Bar</option>
                                <option value="doughnut">Doughnut</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="input-group input-group-sm mb-2">
                        <label className="input-group-text" htmlFor="projectsChartType">
                            Projects Chart Type
                        </label>
                        <div className="input-group-text p-0">
                            <select
                                className="form-select form-select-sm"
                                name="projects-chart-type"
                                onChange={(e) => handleOnChange(setProjectsChartType, e.target.value)}
                                defaultValue={projectsChartType}
                                id="projectsChartType"
                            >
                                <option value="bar">Bar</option>
                                <option value="doughnut">Doughnut</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-md-12 text-end">
                <button className="btn btn-sm btn-outline-success" type="button" onClick={saveSettings}>Save</button>
                <div className="text-danger"><small>{errorMessage}</small></div>
                <div className="text-success"><small>{successMessage}</small></div>
            </div>
        </div >
    )
}