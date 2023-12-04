import { useEffect, useState } from 'react';
import moment from 'moment';

import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

import { getStatsPomodorosCountApi } from 'services/api/PomodoroApiService';

export const CalendarChart = ({ subject }) => {

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [type, setType] = useState('user');
    const [typeId, setTypeId] = useState(0);
    const [chartData, setChartData] = useState({ label: '', labels: [], data: [], colors: [] })

    useEffect(
        () => {
            retrieveStatsPomodorosCount({
                startDate: moment().add(-1, 'y').toISOString(),
                endDate: moment().add(0, 'y').toISOString()
            })
        },
        [] // eslint-disable-line react-hooks/exhaustive-deps
    )

    const retrieveStatsPomodorosCount = ({ startDate, endDate }) => {
        setStartDate(startDate);
        setEndDate(endDate);
        getStatsPomodorosCountApi({ startDate, endDate, type, typeId, subject })
            .then(response => {
                const updated_data = {
                    data: [],
                    // label: `Project Categories (${label})`
                }
                response.data.forEach((element, i) => {
                    // console.debug(element);
                    updated_data.data.push({
                        date: element[1],
                        count: element[0]
                    })
                });
                // console.debug(updated_data);
                setChartData(updated_data)
                // console.debug("retrieved updated data: ", chartData);
            })
            .catch(error => console.error(error.message))
    }

    return (
        <div>
            <CalendarHeatmap
                startDate={startDate}
                endDate={endDate}
                values={chartData.data}
            />
        </div>
    )
}

