import { useEffect, useRef, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom';

export default function BreakTimerComponent() {

    const Ref = useRef(null);

    const [breakStatus, setBreakStatus] = useState('idle')

    const [breakTimer, setBreakTimer] = useState('1:00')

    const [breakTimeRemaining, setBreakTimeRemaining] = useState(1 * 60);

    const calculateTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        return {
            total, minutes, seconds
        };
    }

    const startBreakTimer = (e) => {
        let { total, minutes, seconds }
            = calculateTimeRemaining(e);
        if (total >= 0) {

            // update the timer
            // check if less than 10 then we need to 
            // add '0' at the beginning of the variable
            setBreakTimer(
                (minutes > 9 ? minutes : '0' + minutes) + ':'
                + (seconds > 9 ? seconds : '0' + seconds)
            )
            setBreakTimeRemaining(total / 1000);
            if (total === 0) {
                console.log('from startBreakTimer', total)
                // todo: find better way to update timeRemaining
                // timeRemaing in this thread has different value
                // hence passing it as method parameter
                updateBreak('break_finished')
            }
        }
    }

    const clearBreakTimer = (e) => {

        // If you try to remove this line the 
        // updating of timer Variable will be
        // after 1000ms or 1sec
        if (Ref.current) clearInterval(Ref.current);
        const interval_id = setInterval(() => {
            console.log('break ', breakTimeRemaining);
            if (breakStatus == 'break_started') {
                startBreakTimer(e);
            } else if (breakStatus == 'break_finished') {
                clearInterval(interval_id);
            }
        }, 1000)
        Ref.current = interval_id;
        return interval_id;
    }

    const getBreakDeadTime = () => {
        let deadline = new Date();

        // This is where you need to adjust if 
        // you entend to add more time
        deadline.setSeconds(deadline.getSeconds() + breakTimeRemaining);
        console.log(deadline);
        return deadline;
    }

    const updateBreak = (s) => {
        console.log(s);
        setBreakStatus(s);
    }

    useEffect(() => {
        const id = clearBreakTimer(getBreakDeadTime());
        console.log('break status changed to ' + breakStatus)
        return () => {
            // console.log('fix for switch to different component')
            clearInterval(id);  // fix for switching to different component
        };
    }, [breakStatus]);


    return (
        <div className="BerakComponent">
            <div className="container">

                <div>
                    <div className="fs-1 p-3 mb-2 text-white" style={{ backgroundColor: 'grey' }}>
                        {breakTimer}
                    </div>
                    {
                        breakStatus == 'idle'
                        &&
                        <div>
                            <div className="btn btn-success m-5" onClick={() => updateBreak('break_started')}>Start Break</div>
                        </div>
                    }
                    {
                        breakStatus == 'break_started'
                        &&
                        <div>
                            <div className="btn btn-success m-5" onClick={() => updateBreak('break_finished')}>Finish Break</div>
                        </div>
                    }
                </div>
            </div>

        </div>
    )
}