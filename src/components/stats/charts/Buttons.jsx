import { useEffect, useState } from "react"
import moment from "moment"

export const Buttons = ({
    retrievePomodoros,
    buttonsStates,
    setButtonsStates,
    showDateString = true,
    showLimit = true
}) => {

    const [limit, setLimit] = useState(buttonsStates.limit)
    const [offset, setOffset] = useState(buttonsStates.offset)

    const [dateString, setDateString] = useState(buttonsStates.dateString)

    const [startDate, setStartDate] = useState(moment().startOf('day').toISOString())
    const [endDate, setEndDate] = useState(moment().startOf('day').add(1, 'd').toISOString())

    // to retrive data after click on bottons
    useEffect(
        () => {
            // update dates for component re render with updated limit and offset
            const { start, end } = updateDates(limit, offset)
            retrievePomodoros({ startDate: start, endDate: end, limit, offset })
            setButtonsStates({
                limit: limit,
                offset: offset,
                dateString: dateString
            })
        }, [startDate, endDate] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function updateOffset(val) {
        updateDates(limit, offset + val)
        setOffset(offset + val);
    }

    function updateLimit(val) {
        // console.debug('updating limit')
        updateDates(val, 0)
        setLimit(val);
        setOffset(0);
    }

    // need to get updated limit and offset (to avoid asynchronous execution)
    function updateDates(limit, offset) {
        // console.debug('updated limit & offset: ', limit, offset)
        let start;
        let end;
        let str;
        if (limit === 'daily') {
            const date = moment().startOf('day').add(offset, 'd');
            start = date.clone();
            end = date.clone().endOf('day');
            str = date.format('DD MMM');
        } else if (limit === 'weekly') {
            // substract 1 day first and add it later: to make monday as start of the week
            const date = moment().add(-1, 'd').add(offset, 'w');
            start = date.clone().startOf('week').add(1, 'd');
            end = date.clone().endOf('week').add(1, 'd');
            str = start.format('DD MMM') + "-" + end.format('DD MMM');
        } else if (limit === 'monthly') {
            const date = moment().add(offset, 'M');
            start = date.clone().startOf('month');
            end = date.clone().endOf('month');
            str = date.format('MMM');
        }
        start = start.toISOString();
        end = end.toISOString();

        setDateString(str);
        setStartDate(start);
        setEndDate(end);

        return { start, end }
    }

    return (
        <div className="container">
            {
                showLimit &&
                <div>
                    <button type="button" className={"btn btn-sm btn-outline-secondary " + (limit === "daily" ? "active" : "")} onClick={() => updateLimit('daily')}>Daily</button>
                    <button type="button" className={"btn btn-sm btn-outline-secondary " + (limit === "weekly" ? "active" : "")} onClick={() => updateLimit('weekly')}>Weekly</button>
                    <button type="button" className={"btn btn-sm btn-outline-secondary " + (limit === "monthly" ? "active" : "")} onClick={() => updateLimit('monthly')}>Monthly</button>
                </div>
            }

            <div className="row">
                <div className="col-3">
                    <i className="btn btn-sm btn-outline-secondary py-0 px-1 lh-sm bi bi-arrow-left" onClick={() => updateOffset(-1)}></i>
                </div>
                <div className="col-6">
                    <small>
                        {showDateString && dateString}
                    </small>
                </div>
                <div className="col-3">
                    <i className="btn btn-sm btn-outline-secondary py-0 px-1 lh-sm bi bi-arrow-right" onClick={() => updateOffset(1)}></i>
                </div>
            </div>
        </div>
    )
}