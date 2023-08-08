import { useState } from 'react'
import { putUserSettingsApi } from '../services/api/AuthApiService'
import { useAuth } from '../services/auth/AuthContext';

export default function UserSettingsComponent() {

    const authContext = useAuth();
    const userSettings = authContext.userSettings;

    const [enableChartScale, setEnableChartScale] = useState(userSettings.enableChartScale)
    const [chartScale, setChartScale] = useState(userSettings.chartScale)
    const [enableChartWeeklyAverage, setEnableChartWeeklyAverage] = useState(userSettings.enableChartWeeklyAverage)
    const [chartWeeklyAverage, setChartWeeklyAverage] = useState(userSettings.chartWeeklyAverage)
    const [enableChartMonthlyAverage, setEnableChartMonthlyAverage] = useState(userSettings.enableChartMonthlyAverage)
    const [chartMonthlyAverage, setChartMonthlyAverage] = useState(userSettings.chartMonthlyAverage)
    const [pomodoroLength, setPomodoroLength] = useState(userSettings.pomodoroLength)
    const [enableStopwatch, setEnableStopwatch] = useState(userSettings.enableStopwatch)
    const [enableStopwatchAudio, setEnableStopwatchAudio] = useState(userSettings.enableStopwatchAudio)

    const [errorMessage, setErrorMessage] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    function handleSubmit(error) {
        error.preventDefault();
        setErrorMessage('')

        const request_settings = {
            id: userSettings.id,
            enableChartScale,
            chartScale,
            enableChartWeeklyAverage,
            chartWeeklyAverage,
            enableChartMonthlyAverage,
            chartMonthlyAverage,
            pomodoroLength,
            enableStopwatch,
            enableStopwatchAudio
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
            })
            .catch(error => {
                console.error(error.message)
                setErrorMessage(error.message)
            })

    }

    return (
        <div>
            <h6 className='text-start'>Settings</h6>
            <form onSubmit={handleSubmit}>
                <div className="row">

                    <div className="col-md-4">
                        <div className="input-group input-group-sm mb-3">
                            <div className="input-group-text">
                                <input
                                    type="checkbox"
                                    name="enableChartScale"
                                    className="form-check-input mt-0"
                                    checked={enableChartScale}
                                    onChange={(e) => setEnableChartScale(e.target.checked)}
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
                                placeholder="Chart Scale"
                                onChange={(e) => setChartScale(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="input-group input-group-sm mb-3">
                            <div className="input-group-text">
                                <input
                                    type="checkbox"
                                    name="enableChartWeeklyAverage"
                                    className="form-check-input mt-0"
                                    checked={enableChartWeeklyAverage}
                                    onChange={(e) => setEnableChartWeeklyAverage(e.target.checked)}
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
                                placeholder="Chart Weekly Average"
                                onChange={(e) => setChartWeeklyAverage(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="input-group input-group-sm mb-3">
                            <div className="input-group-text">
                                <input
                                    type="checkbox"
                                    name="enableChartMonthlyAverage"
                                    className="form-check-input mt-0"
                                    checked={enableChartMonthlyAverage}
                                    onChange={(e) => setEnableChartMonthlyAverage(e.target.checked)}
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
                                placeholder="Chart Monthly Average"
                                onChange={(e) => setChartMonthlyAverage(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="input-group input-group-sm mb-3">
                            <div className="input-group-text">
                                <input
                                    type="checkbox"
                                    name="enableStopwatch"
                                    className="form-check-input mt-0"
                                    checked={enableStopwatch}
                                    onChange={(e) => setEnableStopwatch(e.target.checked)}
                                    id="eStopwatch"
                                />
                            </div>
                            <label className="input-group-text" htmlFor="eStopwatch">
                                Enable Stopwatch after a break
                            </label>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="input-group input-group-sm mb-3">
                            <div className="input-group-text">
                                <input
                                    type="checkbox"
                                    name="enableStopwatchAudio"
                                    className="form-check-input mt-0"
                                    checked={enableStopwatchAudio}
                                    onChange={(e) => setEnableStopwatchAudio(e.target.checked)}
                                    id="eStopwatchAudio"
                                />
                            </div>
                            <label className="input-group-text" htmlFor="eStopwatchAudio">
                                Enable Stopwatch Audio after a break
                            </label>
                        </div>
                    </div>

                    <div className="col-md-4">
                        <div className="input-group input-group-sm mb-3">
                            <label className="input-group-text" htmlFor="pomodoroLength">
                                Default Pomodoro Length
                            </label>
                            <input
                                type="number"
                                name="pomodoroLength"
                                className="form-control"
                                value={pomodoroLength}
                                placeholder="Default Pomodoro Length"
                                onChange={(e) => setPomodoroLength(e.target.value)}
                                required
                                id="pomodoroLength"
                            />
                        </div>
                    </div>

                    <div className="text-danger small">{errorMessage}</div>
                    <div className="col-md-12 text-end">
                        <button className="btn btn-sm btn-success" type="submit">Save</button>
                        <div className="text-success">
                            <small>
                                {successMessage}
                            </small>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}