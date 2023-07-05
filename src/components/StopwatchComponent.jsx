import { useEffect, useRef, useState } from 'react'

export default function StopwatchComponent() {

    const Ref = useRef(null);

    const [stopwatch, setStopwatch] = useState('00:00')

    const calculateStopwatchTime = (startTime) => {
        const total = Date.now() - startTime;
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        return { total, minutes, seconds };
    }

    const updateStopwatch = (startTime) => {
        let { total, minutes, seconds }
            = calculateStopwatchTime(startTime);

        // update the timer
        // check if less than 10 then we need to 
        // add '0' at the beginning of the variable
        setStopwatch(
            (minutes > 9 ? minutes : '0' + minutes) + ':'
            + (seconds > 9 ? seconds : '0' + seconds)
        )
        // console.log(total / 1000)
    }

    const refreshStopwatch = (startTime) => {

        // If you try to remove this line the 
        // updating of timer Variable will be
        // after 1000ms or 1sec
        if (Ref.current) clearInterval(Ref.current);
        const interval_id = setInterval(() => {
            // console.log('break ', breakStatus, breakTimeRemaining);
            updateStopwatch(startTime);
        }, 1000)
        Ref.current = interval_id;
        return interval_id;
    }

    useEffect(() => {
        let intervalId = refreshStopwatch(Date.now())
        return (() => {
            clearInterval(intervalId)
        })
    }, [])

    return (
        <div className="BreakComponent">

            <div className="fs-1 mb-2" style={{ backgroundColor: 'white' }}>
                {stopwatch}
            </div>
            <p className="text-danger">Break has ended, start new pomodoro</p>

        </div>
    )
}