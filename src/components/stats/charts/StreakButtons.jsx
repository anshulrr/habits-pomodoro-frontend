import { useEffect, useState } from "react"
import moment from "moment"

export const StreakButtons = ({
    retrievePomodoros,
    buttonsStates,
    setButtonsStates,
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
                startDate: start,   // used by streak chart
                endDate: end,
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
        let start;
        let end;
        let str;
        // console.debug({ dateString, offset, limit })
        if (limit === 'current') {
            const date = moment();
            start = date.clone().add(-1, 'y').startOf('day');
            end = date.clone();
            str = 'Current';
        } else {
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
            <div>
                <button type="button" className={"btn btn-sm py-0 px-1 btn-outline-secondary " + (limit === "current" ? "active" : "")} onClick={() => updateLimit('current')}>Current</button>
                <button type="button" className={"btn btn-sm py-0 px-1 btn-outline-secondary " + (limit === "yearly" ? "active" : "")} onClick={() => updateLimit('yearly')}>Yearly</button>
            </div>

            <div className="row">
                <div className="col-3">
                    {
                        limit === 'yearly' &&
                        <i className="btn btn-sm btn-outline-secondary py-0 px-1 lh-sm bi bi-arrow-left" onClick={() => updateOffset(offset - 1)}></i>
                    }
                </div>
                <div className="col-6">
                    <small>
                        {dateString}
                    </small>
                </div>
                <div className="col-3">
                    {
                        limit === 'yearly' &&
                        <i className={"btn btn-sm btn-outline-secondary py-0 px-1 lh-sm bi bi-arrow-right" + (offset === 0 ? " disabled" : "")} onClick={() => updateOffset(offset + 1)}></i>
                    }
                </div>
            </div>
        </div>
    )
}