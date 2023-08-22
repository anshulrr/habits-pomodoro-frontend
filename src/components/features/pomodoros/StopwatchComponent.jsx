import { useEffect, useRef, useState } from 'react'

export default function StopwatchComponent({ message }) {

    const Ref = useRef(null);

    const [stopwatch, setStopwatch] = useState('00:00:00')

    const calculateStopwatchTime = (startTime) => {
        let total = Date.now() - startTime;
        const seconds = Math.floor(total / 1000) % 60;
        const minutes = Math.floor(total / 1000 / 60) % 60;
        const hours = Math.floor(total / 1000 / 60 / 60);
        return { hours, minutes, seconds };
    }

    const updateStopwatch = (startTime) => {
        let { hours, minutes, seconds }
            = calculateStopwatchTime(startTime);

        // update the timer
        // check if less than 10 then we need to 
        // add '0' at the beginning of the variable
        setStopwatch(
            (hours > 9 ? hours : '0' + hours) + ':' +
            (minutes > 9 ? minutes : '0' + minutes) + ':'
            + (seconds > 9 ? seconds : '0' + seconds)
        )
        // console.debug(total / 1000)
    }

    const refreshStopwatch = (startTime) => {

        // If you try to remove this line the 
        // updating of timer Variable will be
        // after 1000ms or 1sec
        if (Ref.current) clearInterval(Ref.current);
        const interval_id = setInterval(() => {
            // console.debug('break ', breakStatus, breakTimeRemaining);
            updateStopwatch(startTime);
        }, 1000)
        Ref.current = interval_id;
        return interval_id;
    }

    useEffect(() => {
        let intervalId = refreshStopwatch(Date.now())
        // console.debug('re-render StopwatchComponent', intervalId)
        return (() => {
            clearInterval(intervalId)
        })
    }, []) // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="BreakComponent">
            {
                message &&
                <div className="text-secondary text-end" style={{ fontVariantNumeric: "tabular-nums" }}>
                    <small>
                        {message} ({stopwatch})
                    </small>
                </div>
            }
            {
                !message &&
                <div className="text-danger text-end" style={{ fontVariantNumeric: "tabular-nums" }}>
                    <small>
                        {'Break has ended, start again?'} ({stopwatch})
                    </small>
                </div>
            }
        </div >
    )
}