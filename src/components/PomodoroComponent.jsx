import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { pausePomodoroApi } from '../services/api/PomodoroApiService';

export default function PomodoroComponent() {

    // We need ref in this, because we are dealing
    // with JS setInterval to keep track of it and
    // stop it when needed
    const Ref = useRef(null);

    const { task_id, id } = useParams()

    const [timer, setTimer] = useState('25:00')

    const [timeElapsed, setTimeElapsed] = useState(0);

    const [status, setStatus] = useState('started')

    const getTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        return {
            total, minutes, seconds
        };
    }

    const startTimer = (e) => {
        let { total, minutes, seconds }
            = getTimeRemaining(e);
        if (total >= 0) {

            // update the timer
            // check if less than 10 then we need to 
            // add '0' at the beginning of the variable
            setTimer(
                (minutes > 9 ? minutes : '0' + minutes) + ':'
                + (seconds > 9 ? seconds : '0' + seconds)
            )
            setTimeElapsed(total / 1000);
        }
    }
    const clearTimer = (e) => {

        // If you adjust it you should also need to
        // adjust the Endtime formula we are about
        // to code next    
        setTimer('25:00');

        // If you try to remove this line the 
        // updating of timer Variable will be
        // after 1000ms or 1sec
        if (Ref.current) clearInterval(Ref.current);
        const id = setInterval(() => {
            console.log(status);
            if (status == 'started') {
                startTimer(e);
            }
        }, 1000)
        Ref.current = id;
        return id;
    }

    const getDeadTime = () => {
        let deadline = new Date();

        // This is where you need to adjust if 
        // you entend to add more time
        deadline.setSeconds(deadline.getSeconds() + 25 * 60);
        return deadline;
    }

    // We can use useEffect so that when the component
    // mount the timer will start as soon as possible

    // We put empty array to act as componentDid
    // mount only
    useEffect(() => {
        const id = clearTimer(getDeadTime());
        return () => {
            clearInterval(id);  // fix for switching to different component
        };
    }, [status]);

    const updatePomodoro = (id, s) => {
        setStatus(s)
        console.log("status updated to: ", status, timeElapsed)
        const pomodoro = {
            timeElapsed,
            status: s  // // setState is not working for this
        }

        pausePomodoroApi(id, pomodoro)
            .then(response => {
                console.log(response)
            })
            .catch(error => console.log(error))
    }

    return (
        <div className="PomodoroComponent">
            {timer}

            <div className="btn btn-warning m-5" onClick={() => updatePomodoro(id, "paused")}>Pause</div>
            <div className="btn btn-warning m-5" onClick={() => updatePomodoro(id, "started")}>Start</div>

        </div>
    )
}