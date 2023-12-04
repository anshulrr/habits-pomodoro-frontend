import { useState } from "react"

import { getProjectCategoriesPomodorosApi } from "services/api/PomodoroApiService";
import { calculateScaleAndLabel, calculateScaleForAdjustedAvg } from "services/helpers/chartHelper";

import { BarChart } from "components/stats/charts/BarChart";
import { DoughnutChart } from "components/stats/charts/DoughnutChart";

export const ProjectCategoriesChart = ({ includeCategories, subject, statsSettings, buttonsStates, setButtonsStates }) => {

    const [chartData, setChartData] = useState({ label: '', labels: [], data: [], colors: [] })
    const [showLoader, setShowLoader] = useState(false);

    function retrieveProjectCategoriesPomodoros({ startDate, endDate, limit, offset }) {
        setShowLoader(true);
        // calculate scale and label according to user settings
        let { scale, label } = calculateScaleAndLabel({ limit, ...statsSettings });

        if (offset === 0) {
            scale = calculateScaleForAdjustedAvg({ limit, scale, ...statsSettings });
        }

        getProjectCategoriesPomodorosApi({ startDate, endDate, includeCategories, subject })
            .then(response => {
                const updated_data = {
                    labels: [],
                    data: [],
                    colors: [],
                    label: `Project Categories (${label})`
                }
                response.data.forEach((element, i) => {
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
                statsSettings.projectCategoriesChartType === 'bar' &&
                <BarChart
                    chartData={chartData}
                    retrievePomodoros={retrieveProjectCategoriesPomodoros}
                    setButtonsStates={setButtonsStates}
                    buttonsStates={buttonsStates}
                    showLoader={showLoader}
                />
            }

            {
                statsSettings.projectCategoriesChartType === 'doughnut' &&
                <DoughnutChart
                    chartData={chartData}
                    retrievePomodoros={retrieveProjectCategoriesPomodoros}
                    setButtonsStates={setButtonsStates}
                    buttonsStates={buttonsStates}
                    showLoader={showLoader}
                />
            }
        </>
    );
};