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

export const truncateString = (str, n = 10) => {
    return (str.length > n) ? str.slice(0, n - 1) + '...' : str;
}