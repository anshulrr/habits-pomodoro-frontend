import { useAuth } from "../auth/AuthContext";


export const calculateScaleAndLabel = ({ limit, userSettings }) => {

    let scale = 1;
    let label = 'mins';
    if (userSettings?.enableChartScale) {
        label = "scaled " + label;
        scale *= userSettings?.chartScale;
    }
    // console.debug({ scale });
    if (limit === 'monthly' && userSettings?.enableChartMonthlyAverage) {
        label = "avg " + label;
        scale *= userSettings?.chartMonthlyAverage;
    } else if (limit === 'weekly' && userSettings?.enableChartWeeklyAverage) {
        label = "avg " + label;
        scale *= userSettings?.chartWeeklyAverage;
    }
    // console.debug({ scale, label });
    return { scale, label };
}