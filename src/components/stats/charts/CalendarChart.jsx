import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

import { timeToDisplay } from 'services/helpers/listsHelper';

import { StreakButtons } from "components/stats/charts/StreakButtons";

export const CalendarChart = ({ chartData,
    reloadData,
    tasksMap,
    projectsMap,
    showLoader,
    retrievePomodoros,
    buttonsStates,
    setButtonsStates,
}) => {

    // console.debug(tasksMap, projectsMap)

    function checkType(elementsMap, hours, value) {
        let element = elementsMap.get(reloadData.dataTypeId);

        let type = element.type;
        if (element.type === 'bad') {
            if (value.count > element.pomodoroLength * element.dailyLimit) {
                type = 'bad';
            } else {
                type = `neutral`;
            }
        }
        if (element.type === 'good') {
            if (value.count >= element.pomodoroLength * element.dailyLimit) {
                type = 'good';
            } else {
                type = `neutral`;
            }
        }
        // above specified hours has darkest color
        const max = hours * 60;
        let range = Math.round(value.count / max * 10) * 10;
        range = range <= 100 ? range : 100;
        return `color-${type}-${range}`;
    }

    return (
        <div>
            <StreakButtons
                retrievePomodoros={retrievePomodoros}
                buttonsStates={buttonsStates}
                setButtonsStates={setButtonsStates}
            />

            <CalendarHeatmap
                startDate={buttonsStates.startDate}
                endDate={buttonsStates.endDate}
                values={chartData.data}
                showWeekdayLabels={true}
                classForValue={(value) => {
                    if (showLoader || !value) {
                        return 'color-empty';
                    }

                    if (reloadData.dataType === 'task' && reloadData.dataTypeId !== 0) {
                        return checkType(tasksMap, 6, value);
                    }

                    if (reloadData.dataType === 'project' && reloadData.dataTypeId !== 0) {
                        return checkType(projectsMap, 9, value);
                    }

                    // time spent above 12 hours has darkest color
                    const max = 12 * 60;
                    let range = Math.round(value.count / max * 10) * 10;
                    range = range <= 100 ? range : 100;
                    return `color-neutral-${range}`;
                }}
                tooltipDataAttrs={value => {
                    if (!value || !value.date) {
                        return null;
                    }
                    return {
                        'data-tooltip-id': 'streak-tooltip',
                        'data-tooltip-content': `${value.date}: ${timeToDisplay(value.count, true)}`
                    };
                }}
            />
            <Tooltip id="streak-tooltip" />

        </div >
    )
}

