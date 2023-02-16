import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import { pausePomodoroApi } from '../services/api/PomodoroApiService';

export default function PomodoroComponent() {

    // We need ref in this, because we are dealing
    // with JS setInterval to keep track of it and
    // stop it when needed
    const Ref = useRef(null);

    const { task_id, id, length } = useParams()

    const [timer, setTimer] = useState(length + ':00')

    const [timeRemaining, setTimeRemaining] = useState(length * 60);

    const [status, setStatus] = useState('started')

    const calculateTimeRemaining = (e) => {
        const total = Date.parse(e) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        return {
            total, minutes, seconds
        };
    }

    const startTimer = (e) => {
        let { total, minutes, seconds }
            = calculateTimeRemaining(e);
        if (total >= 0) {

            // update the timer
            // check if less than 10 then we need to 
            // add '0' at the beginning of the variable
            setTimer(
                (minutes > 9 ? minutes : '0' + minutes) + ':'
                + (seconds > 9 ? seconds : '0' + seconds)
            )
            setTimeRemaining(total / 1000);
        }
    }
    const clearTimer = (e) => {

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
        deadline.setSeconds(deadline.getSeconds() + timeRemaining);
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
        console.log("status updated to: ", status, timeRemaining)
        const pomodoro = {
            timeElapsed: length * 60 - timeRemaining,
            status: s  // // setState is not working for this synchronously
        }

        pausePomodoroApi(id, pomodoro)
            .then(response => {
                console.log(response)
            })
            .catch(error => console.log(error))
    }

    return (
        <div className="PomodoroComponent">
            <div className="container">
                <div className="fs-1 p-3 mb-2 bg-danger text-white">
                    {timer}
                </div>

                <div className="btn btn-warning m-5" onClick={() => updatePomodoro(id, "paused")}>Pause</div>
                <div className="btn btn-success m-5" onClick={() => updatePomodoro(id, "started")}>Start</div>
            </div>

        </div>
    )
}