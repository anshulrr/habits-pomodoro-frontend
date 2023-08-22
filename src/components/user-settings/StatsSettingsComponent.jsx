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
    const [enableChartAdjustedWeeklyMonthlyAverage, setEnableChartAdjustedWeeklyMonthlyAverage] = useState(userSettings.enableChartAdjustedWeeklyMonthlyAverage)
    const [tasksChartType, setTasksChartType] = useState('doughnut')
    const [projectsChartType, setProjectsChartType] = useState('bar')

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
            enableChartAdjustedWeeklyMonthlyAverage,
            tasksChartType,
            projectsChartType
        };
        // console.debug(updatedStatsSetting)
        setStatsSettings(updatedStatsSetting)

        // to reload chart components
        setReload(prevReload => prevReload + 1)

        setErrorMessage('')
    }

    function handleOnChange(fun, val) {
        fun(val)
        setErrorMessage("Click on Fetch to update stats")
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
        } else {
            return true;
        }
        return false;
    }

    return (
        <div className="row mb-3">

            <div className="col-md-12">
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
                        Enable Scale
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

            <div className="col-md-12">
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
                        Enable Weekly Avg
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

            <div className="col-md-12">
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
                        Enable Monthly Avg
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

            <div className="col-md-12 mb-2">
                <select
                    className="form-select form-select-sm"
                    name="tasks-chart-type"
                    onChange={(e) => handleOnChange(setTasksChartType, e.target.value)}
                    defaultValue={tasksChartType}
                >
                    <option value="0" disabled selected>Tasks Chart Type</option>
                    <option value="bar">Bar</option>
                    <option value="doughnut">Doughnut</option>
                </select>
            </div>

            <div className="col-md-12 mb-2">
                <select
                    className="form-select form-select-sm"
                    name="projects-chart-type"
                    onChange={(e) => handleOnChange(setProjectsChartType, e.target.value)}
                    defaultValue={projectsChartType}
                >
                    <option value="0" disabled>Projects Chart Type</option>
                    <option value="bar">Bar</option>
                    <option value="doughnut">Doughnut</option>
                </select>
            </div>

            <div className="text-danger"><small>{errorMessage}</small></div>

            <div className="col-md-12 text-end">
                <button className="btn btn-sm btn-outline-success" type="button" onClick={updateSettings}>Fetch</button>
            </div>

        </div>
    )
}