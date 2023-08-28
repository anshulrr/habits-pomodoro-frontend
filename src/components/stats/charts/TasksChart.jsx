import { useState } from "react"

import { getTasksPomodorosApi } from "services/api/PomodoroApiService";
import { calculateScaleAndLabel, calculateScaleForAdjustedAvg, truncateString } from "services/helpers/chartHelper";
import { BarChart } from "components/stats/charts/BarChart";
import { DoughnutChart } from "components/stats/charts/DoughnutChart";

export const TasksChart = ({ includeCategories, statsSettings, buttonsStates, setButtonsStates }) => {
    // console.debug('from TasksChart', includeCategories, statsSettings)

    const [chartData, setChartData] = useState({ label: '', labels: [], data: [], colors: [] })

    function retrieveTasksPomodoros({ startDate, endDate, limit, offset }) {
        // console.debug(startDate, endDate)
        // console.debug("t", includeCategories)

        let { scale, label } = calculateScaleAndLabel({ limit, ...statsSettings });

        if (offset === 0) {
            scale = calculateScaleForAdjustedAvg({ limit, scale, ...statsSettings });
        }

        getTasksPomodorosApi({ startDate, endDate, includeCategories })
            .then(response => {
                // console.debug(response)
                const updated_data = {
                    labels: [],
                    data: [],
                    colors: [],
                    label: `Tasks (${label})`
                }
                response.data.forEach(element => {
                    // console.debug(element);
                    updated_data.colors.push(element[2]);
                    updated_data.labels.push(truncateString(element[1], 20));
                    updated_data.data.push(element[0] / scale);
                });
                // console.debug(updated_data);
                setChartData(updated_data)
                // console.debug("retrieved updated data: ", chartData);
            })
            .catch(error => console.error(error.message))
    }

    return (
        <>
            {
                statsSettings.tasksChartType === 'bar' &&
                <BarChart
                    chartData={chartData}
                    retrievePomodoros={retrieveTasksPomodoros}
                    setButtonsStates={setButtonsStates}
                    buttonsStates={buttonsStates}
                />
            }

            {
                statsSettings.tasksChartType === 'doughnut' &&
                <DoughnutChart
                    chartData={chartData}
                    retrievePomodoros={retrieveTasksPomodoros}
                    setButtonsStates={setButtonsStates}
                    buttonsStates={buttonsStates}
                />
            }
        </>
    );
};