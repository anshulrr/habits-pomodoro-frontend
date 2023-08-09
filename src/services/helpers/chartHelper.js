import moment from "moment";

export const calculateScaleAndLabel = ({
    limit,
    enableChartScale,
    chartScale,
    enableChartMonthlyAverage,
    chartMonthlyAverage,
    enableChartWeeklyAverage,
    chartWeeklyAverage
}) => {

    let scale = 1;
    let label = 'mins';
    if (enableChartScale) {
        label = "scaled " + label;
        scale *= chartScale;
    }
    // console.debug({ scale });
    if (limit === 'monthly' && enableChartMonthlyAverage) {
        label = "avg " + label;
        scale *= chartMonthlyAverage;
    } else if (limit === 'weekly' && enableChartWeeklyAverage) {
        label = "avg " + label;
        scale *= chartWeeklyAverage;
    }
    // console.debug({ scale, label });
    return { scale, label };
}

export const calculateScaleForAdjustedAvg = ({
    limit,
    scale,
    enableChartAdjustedWeeklyMonthlyAverage,
    enableChartMonthlyAverage,
    chartMonthlyAverage,
    enableChartWeeklyAverage,
    chartWeeklyAverage
}) => {
    // console.debug({ scale });
    // assuming starting days of week/month as working day
    if (enableChartAdjustedWeeklyMonthlyAverage) {
        if (limit === 'weekly' &&
            enableChartWeeklyAverage &&
            chartWeeklyAverage > moment().weekday()
        ) {
            scale = scale / chartWeeklyAverage * moment().weekday();
        } else if (limit === 'monthly' &&
            enableChartMonthlyAverage &&
            chartMonthlyAverage > moment().date()
        ) {
            scale = scale / chartMonthlyAverage * moment().date();
        }
    }
    // console.debug({ scale });
    return scale;
}

export const truncateString = (str, n = 10) => {
    return (str.length > n) ? str.slice(0, n - 1) + '...' : str;
}