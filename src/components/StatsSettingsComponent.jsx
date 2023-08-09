import { useEffect, useState } from 'react'
import { useAuth } from '../services/auth/AuthContext';

export default function StatsSettingsComponent({ setStatsSettings, setReload }) {

    const authContext = useAuth();
    const userSettings = authContext.userSettings;

    const [enableChartScale, setEnableChartScale] = useState(userSettings.enableChartScale)
    const [chartScale, setChartScale] = useState(userSettings.chartScale)
    const [enableChartWeeklyAverage, setEnableChartWeeklyAverage] = useState(userSettings.enableChartWeeklyAverage)
    const [chartWeeklyAverage, setChartWeeklyAverage] = useState(userSettings.chartWeeklyAverage)
    const [enableChartMonthlyAverage, setEnableChartMonthlyAverage] = useState(userSettings.enableChartMonthlyAverage)
    const [chartMonthlyAverage, setChartMonthlyAverage] = useState(userSettings.chartMonthlyAverage)

    const message = "Click on Fetch to update stats";
    const [errorMessage, setErrorMessage] = useState('')

    useEffect(
        () => {
            updateSettings()
        }, []   // eslint-disable-line react-hooks/exhaustive-deps
    )

    function updateSettings() {
        const updatedStatsSetting = {
            enableChartScale,
            chartScale,
            enableChartWeeklyAverage,
            chartWeeklyAverage,
            enableChartMonthlyAverage,
            chartMonthlyAverage,
        };
        // console.debug(updatedStatsSetting)
        setStatsSettings(updatedStatsSetting)

        // to reload chart components
        setReload(prevReload => prevReload + 1)

        setErrorMessage('')
    }

    function updateInput(fun, val) {
        fun(val)
        setErrorMessage(message)
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
                            onChange={(e) => updateInput(setEnableChartScale, e.target.checked)}
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
                        placeholder="Chart Scale"
                        onChange={(e) => updateInput(setChartScale, e.target.value)}
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
                            onChange={(e) => updateInput(setEnableChartWeeklyAverage, e.target.checked)}
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
                        placeholder="Chart Weekly Average"
                        onChange={(e) => updateInput(setChartWeeklyAverage, e.target.value)}
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
                            onChange={(e) => updateInput(setEnableChartMonthlyAverage, e.target.checked)}
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
                        placeholder="Chart Monthly Average"
                        onChange={(e) => updateInput(setChartMonthlyAverage, e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="text-danger"><small>{errorMessage}</small></div>

            <div className="col-md-12 text-end">
                <button className="btn btn-sm btn-outline-success" type="button" onClick={updateSettings}>Fetch</button>
            </div>

        </div>
    )
}