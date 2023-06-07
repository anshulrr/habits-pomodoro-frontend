import { useEffect, useRef, useState } from 'react'
import { useParams, useLocation, Link } from 'react-router-dom';
import { pausePomodoroApi } from '../services/api/PomodoroApiService';
import BreakTimerComponent from './BreakTimerComponent';

export default function PomodoroComponent() {

    // We need ref in this, because we are dealing
    // with JS setInterval to keep track of it and
    // stop it when needed
    const Ref = useRef(null);

    const { task_id, id, length } = useParams()

    const { state } = useLocation();

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
            // console.log(timeRemaining, total / 1000)
            setTimeRemaining(total / 1000);
            if (total === 0) {
                console.log(total)
                // todo: find better way to update timeRemaining
                // timeRemaing in this thread has different value
                // hence passing it as method parameter
                updatePomodoro(id, 'completed', total);
            }
        }
    }
    const clearTimer = (e) => {

        // If you try to remove this line the 
        // updating of timer Variable will be
        // after 1000ms or 1sec
        if (Ref.current) clearInterval(Ref.current);
        const interval_id = setInterval(() => {
            // console.log(status, timeRemaining, e);
            if (status == 'completed') {
                clearInterval(interval_id);
            } else if (status == 'started') {
                startTimer(e);
            }
        }, 1000)
        Ref.current = interval_id;
        return interval_id;
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

    const updatePomodoro = (id, s, timeRemaining) => {
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
                <h1>{state.task.description}</h1> <h6>({state.project.name})</h6>
                {
                    status != 'completed'
                    &&
                    <div className="fs-1 p-3 mb-2 text-white" style={{ backgroundColor: state.project.color }}>
                        {timer}
                    </div>
                }

                {
                    status == 'started' && status != 'completed'
                    && <div className="btn btn-warning m-5" onClick={() => updatePomodoro(id, "paused", timeRemaining)}>Pause</div>
                }

                {
                    status == 'paused' && status != 'completed'
                    && <div className="btn btn-success m-5" onClick={() => updatePomodoro(id, "started", timeRemaining)}>Start</div>
                }

                {
                    status != 'completed'
                    && <div className="btn btn-danger m-5" onClick={() => updatePomodoro(id, "completed", timeRemaining)}>Mark Completed</div>
                }

                {
                    status == 'completed'
                    && <Link to={"/projects/" + state.project.id + "/tasks"} state={{ project: state.project }}>Return to {state.project.name}</Link>
                }

                {
                    status == 'completed'
                    &&
                    <BreakTimerComponent></BreakTimerComponent>
                }
            </div>

        </div>
    )
}