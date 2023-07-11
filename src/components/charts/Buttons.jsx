import { useEffect, useState } from "react"
import moment from "moment"

export const Buttons = ({ retrievePomodoros, buttonsStates, setButtonsStates, showDateString = true }) => {

    const [limit, setLimit] = useState(buttonsStates.limit)

    const [offset, setOffset] = useState(buttonsStates.offset)

    const [dateString, setDateString] = useState(buttonsStates.dateString)

    // to retrive data after click on bottons
    useEffect(
        () => {
            // console.log('re-render Buttons')
            retrievePomodoros(limit, offset)
            setButtonsStates({
                limit: limit,
                offset: offset,
                dateString: dateString
            })
        }, [offset, limit] // eslint-disable-line react-hooks/exhaustive-deps
    )

    function updateOffset(val) {
        showDateString && updateDateString(limit, offset + val)
        setOffset(offset + val);
    }

    function updateLimit(val) {
        // console.log('updating limit')
        showDateString && updateDateString(val, 0)
        setLimit(val);
        setOffset(0);
    }

    // need to get updated limit and offset (to avoid asynchronous execution)
    function updateDateString(limit, offset) {
        // console.log('updated limit & offset: ', limit, offset)
        if (limit === 'daily') {
            setDateString(moment().add(offset, 'd').format('DD MMM'))
        } else if (limit === 'weekly') {
            const dow = moment().format('e');
            const str = moment().add(-dow + 1, 'd').add(offset, 'w').format('DD MMM') + "-" + moment().add(-dow, 'd').add(offset + 1, 'w').format('DD MMM')
            setDateString(str)
        } else if (limit === 'monthly') {
            const str = moment().add(offset, 'M').format('MMM')
            setDateString(str)
        }
    }

    return (
        <div className="container">
            <button type="button" className="btn btn-sm btn-light" onClick={() => updateLimit('daily')}>Daily</button>
            <button type="button" className="btn btn-sm btn-light" onClick={() => updateLimit('weekly')}>Weekly</button>
            <button type="button" className="btn btn-sm btn-light" onClick={() => updateLimit('monthly')}>Monthly</button>
            <div className="container">

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
        </div>
    )
}