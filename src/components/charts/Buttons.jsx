import { useEffect, useState } from "react"
import moment from "moment"

export const Buttons = ({ retrievePomodoros, showDateString = true }) => {

    const [limit, setLimit] = useState('daily')

    const [offset, setOffset] = useState(0)

    const [dateString, setDateString] = useState(moment().format('DD MMM'))

    // to retrive data after click on bottons
    useEffect(
        () => retrievePomodoros(limit, offset),
        [offset, limit]
    )

    function updateOffset(val) {
        updateDateString(limit, offset + val)
        setOffset(offset + val);
    }

    function updateLimit(val) {
        // console.log('updating limit')
        updateDateString(val, 0)
        setLimit(val);
        setOffset(0);
    }

    // need to get updated limit and offset (to avoid asynchronous execution)
    function updateDateString(limit, offset) {
        // console.log('updated limit & offset: ', limit, offset)
        if (limit == 'daily') {
            setDateString(moment().add(offset, 'd').format('DD MMM'))
        } else if (limit == 'weekly') {
            const dow = moment().format('e');
            const str = moment().add(-dow + 1, 'd').add(offset, 'w').format('DD MMM') + "-" + moment().add(-dow, 'd').add(offset + 1, 'w').format('DD MMM')
            setDateString(str)
        } else if (limit == 'monthly') {
            const str = moment().add(offset, 'M').format('MMM')
            setDateString(str)
        }
    }

    return (
        <div className="container">
            <button type="button" className="btn btn-light" onClick={() => updateLimit('daily')}>Daily</button>
            <button type="button" className="btn btn-light" onClick={() => updateLimit('weekly')}>Weekly</button>
            <button type="button" className="btn btn-light" onClick={() => updateLimit('monthly')}>Monthly</button>
            <div className="container">

                <div className="row">
                    <div className="col-3">
                        <button type="button" className="btn btn-light" onClick={() => updateOffset(-1)}>prev</button>
                    </div>
                    <div className="col-6">
                        <small>
                            {showDateString && dateString}
                        </small>
                    </div>
                    <div className="col-3">
                        <button type="button" className="btn btn-light" onClick={() => updateOffset(1)}>next</button>
                    </div>
                </div>
            </div>
        </div>
    )
}