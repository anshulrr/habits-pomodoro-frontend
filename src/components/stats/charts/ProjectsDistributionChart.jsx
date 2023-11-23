import { useState } from "react"

import { getProjectsPomodorosApi } from "services/api/PomodoroApiService";
import { calculateScaleAndLabel, calculateScaleForAdjustedAvg } from "services/helpers/chartHelper";

import { BarChart } from "components/stats/charts/BarChart";
import { DoughnutChart } from "components/stats/charts/DoughnutChart";

export const ProjectsDistributionChart = ({ includeCategories, subject, statsSettings, buttonsStates, setButtonsStates }) => {
    // console.debug("hi", chartData);
    // console.debug(statsSettings)

    const [chartData, setChartData] = useState({ label: '', labels: [], data: [], colors: [] })
    const [showLoader, setShowLoader] = useState(false);

    function retrieveProjectsPomodoros({ startDate, endDate, limit, offset }) {
        setShowLoader(true);
        // calculate scale and label according to user settings
        let { scale, label } = calculateScaleAndLabel({ limit, ...statsSettings });

        if (offset === 0) {
            scale = calculateScaleForAdjustedAvg({ limit, scale, ...statsSettings });
        }

        // console.debug("p", includeCategories)
        getProjectsPomodorosApi({ startDate, endDate, includeCategories, subject })
            .then(response => {
                // console.debug(response)
                const updated_data = {
                    labels: [],
                    data: [],
                    colors: [],
                    label: `Projects (${label})`
                }
                response.data.forEach(element => {
                    // console.debug(element);
                    updated_data.colors.push(element[2]);
                    updated_data.labels.push(element[1]);
                    updated_data.data.push(element[0] / scale);
                });
                // console.debug(updated_data);
                setChartData(updated_data)
                // console.debug("retrieved updated data: ", chartData);
                setShowLoader(false);
            })
            .catch(error => console.error(error.message))
    }

    return (
        <>
            {
                statsSettings.projectsChartType === 'bar' &&
                <BarChart
                    chartData={chartData}
                    retrievePomodoros={retrieveProjectsPomodoros}
                    setButtonsStates={setButtonsStates}
                    buttonsStates={buttonsStates}
                    showLoader={showLoader}
                />
            }

            {
                statsSettings.projectsChartType === 'doughnut' &&
                <DoughnutChart
                    chartData={chartData}
                    retrievePomodoros={retrieveProjectsPomodoros}
                    setButtonsStates={setButtonsStates}
                    buttonsStates={buttonsStates}
                    showLoader={showLoader}
                />
            }
        </>
    );
};