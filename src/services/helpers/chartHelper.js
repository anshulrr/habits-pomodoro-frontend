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
        if (parseInt(chartScale) === 60) {
            label = "hours"
        } else {
            label = "scaled " + label;
        }
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
    // console.debug({ scale }, moment().date(), moment().endOf('month').date());
    // assuming starting days of week/month as working day
    if (enableChartAdjustedWeeklyMonthlyAverage) {
        if (limit === 'weekly' &&
            enableChartWeeklyAverage &&
            chartWeeklyAverage > moment().isoWeekday()
        ) {
            // distributed at the start of the week
            scale = scale / chartWeeklyAverage * moment().isoWeekday();
        } else if (limit === 'monthly' &&
            enableChartMonthlyAverage
        ) {
            // distributed evenly throughout month
            scale = scale * moment().date() / moment().endOf('month').date();
        }
    }
    // console.debug({ scale });
    return scale;
}

export const truncateString = (str, n = 10) => {
    return (str.length > n) ? str.slice(0, n - 1) + '...' : str;
}