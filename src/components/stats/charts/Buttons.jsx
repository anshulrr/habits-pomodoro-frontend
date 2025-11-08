import { useEffect, useState } from "react"
import moment from "moment"

export const Buttons = ({
    retrievePomodoros,
    buttonsStates,
    setButtonsStates,
    showDateString = true,
    showLimit = true,
    isDummy = false
}) => {

    const [limit, setLimit] = useState(buttonsStates.limit)
    const [offset, setOffset] = useState(buttonsStates.offset)

    const [dateString, setDateString] = useState(buttonsStates.dateString)

    // to retrive data after click on bottons
    useEffect(
        () => {
            // update dates for component re render with updated limit and offset
            const { start, end, str } = updateDates(limit, offset)
            if (isDummy) {
                return;
            }
            retrievePomodoros({ startDate: start, endDate: end, limit, offset })
            setButtonsStates({
                limit: limit,
                offset: offset,
                dateString: str
            })
        }, [offset, limit] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function updateOffset(val) {
        if (isDummy) {
            return;
        }
        setOffset(val);
    }

    function updateLimit(val) {
        if (isDummy) {
            return;
        }
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
            const date = moment().add(offset, 'w');
            start = date.clone().startOf('isoWeek');
            end = date.clone().endOf('isoWeek');
            str = start.format('DD MMM') + "-" + end.format('DD MMM');
        } else if (limit === 'monthly') {
            const date = moment().add(offset, 'M');
            start = date.clone().startOf('month');
            end = date.clone().endOf('month');
            str = date.format('MMM');
        } else if (limit === 'yearly') {
            const date = moment().add(offset, 'y');
            start = date.clone().startOf('year');
            end = date.clone().endOf('year');
            str = date.format('YYYY');
        }
        start = start.toISOString();
        end = end.toISOString();

        setDateString(str);

        return { start, end, str }
    }

    return (
        <div className="container">
            {
                showLimit &&
                <div>
                    <button type="button" className={"btn btn-sm py-0 px-1 btn-outline-secondary " + (limit === "daily" ? "active" : "")} onClick={() => updateLimit('daily')}>Daily</button>
                    <button type="button" className={"btn btn-sm py-0 px-1 btn-outline-secondary " + (limit === "weekly" ? "active" : "")} onClick={() => updateLimit('weekly')}>Weekly</button>
                    <button type="button" className={"btn btn-sm py-0 px-1 btn-outline-secondary " + (limit === "monthly" ? "active" : "")} onClick={() => updateLimit('monthly')}>Monthly</button>
                    <button type="button" className={"btn btn-sm py-0 px-1 btn-outline-secondary " + (limit === "yearly" ? "active" : "")} onClick={() => updateLimit('yearly')}>Yearly</button>
                </div>
            }

            <div className="row">
                <div className="col-3">
                    <i className="btn btn-sm btn-outline-secondary py-0 px-1 lh-sm bi bi-arrow-left" onClick={() => updateOffset(offset - 1)}></i>
                </div>
                <div className="col-6">
                    <small>
                        {showDateString && dateString}
                    </small>
                </div>
                <div className="col-3">
                    <i className={"btn btn-sm btn-outline-secondary py-0 px-1 lh-sm bi bi-arrow-right" + (offset === 0 ? " disabled" : "")} onClick={() => updateOffset(offset + 1)}></i>
                </div>
            </div>
        </div>
    )
}