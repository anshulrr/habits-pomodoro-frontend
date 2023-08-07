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
            retrievePomodoros({ startDate, endDate, limit, offset })
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
        if (limit === 'daily') {
            const date = moment().startOf('day').add(offset, 'd');
            setDateString(date.format('DD MMM'))
            // console.debug(date.unix())
            setStartDate(date.toISOString());
            setEndDate(date.add(1, 'd').toISOString())
        } else if (limit === 'weekly') {
            // substract 1 day first and add it later: to make monday as start of the week
            const date = moment().add(-1, 'd').add(offset, 'w');
            const start = date.clone().startOf('week').add(1, 'd');
            const end = date.clone().endOf('week').add(1, 'd');
            const str = start.format('DD MMM') + "-" + end.format('DD MMM');
            setDateString(str)
            setStartDate(start.toISOString())
            setEndDate(end.toISOString())
        } else if (limit === 'monthly') {
            const date = moment().add(offset, 'M');
            const start = date.clone().startOf('month');
            const end = date.clone().endOf('month');
            const str = date.format('MMM');
            setDateString(str)
            setStartDate(start.toISOString())
            setEndDate(end.toISOString())
        }
    }

    return (
        <div className="container">
            {
                showLimit &&
                <div>
                    <button type="button" className={"btn btn-sm btn-light " + (limit === "daily" ? "active" : "")} onClick={() => updateLimit('daily')}>Daily</button>
                    <button type="button" className={"btn btn-sm btn-light " + (limit === "weekly" ? "active" : "")} onClick={() => updateLimit('weekly')}>Weekly</button>
                    <button type="button" className={"btn btn-sm btn-light " + (limit === "monthly" ? "active" : "")} onClick={() => updateLimit('monthly')}>Monthly</button>
                </div>
            }

            <div className="row">
                <div className="col-3">
                    <i className="bi bi-arrow-left-square" onClick={() => updateOffset(-1)}></i>
                </div>
                <div className="col-6">
                    <small>
                        {showDateString && dateString}
                    </small>
                </div>
                <div className="col-3">
                    <i className="bi bi-arrow-right-square" onClick={() => updateOffset(1)}></i>
                </div>
            </div>
        </div>
    )
}