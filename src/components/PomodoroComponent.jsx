import { useEffect, useRef, useState } from 'react'
// import { useParams, useLocation, Link } from 'react-router-dom';
import { updatePomodoroApi } from '../services/api/PomodoroApiService';
import BreakTimerComponent from './BreakTimerComponent';

export default function PomodoroComponent({ pomodoro, setPomodoro, createNewPomodoro }) {

    // We need ref in this, because we are dealing
    // with JS setInterval to keep track of it and
    // stop it when needed
    const Ref = useRef(null);

    // const { task_id, pomodoro.id, pomodoro.length } = useParams()
    // const { state } = useLocation();

    const [timer, setTimer] = useState(pomodoro.length + ':00')

    const [timeRemaining, setTimeRemaining] = useState(pomodoro.length * 60);

    const [status, setStatus] = useState('started')

    const calculateTimeRemaining = (endTime) => {
        const total = Date.parse(endTime) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        return {
            total, minutes, seconds
        };
    }

    const updateTimer = (endTime) => {
        let { total, minutes, seconds }
            = calculateTimeRemaining(endTime);
        if (total > 0) {

            // update the timer
            // check if less than 10 then we need to 
            // add '0' at the beginning of the variable
            setTimer(
                (minutes > 9 ? minutes : '0' + minutes) + ':'
                + (seconds > 9 ? seconds : '0' + seconds)
            )
            // console.log(timeRemaining, total / 1000)
            setTimeRemaining(total / 1000);
        } else {
            // TODO: find fix for extra seconds elapsed due to inactive tab
            console.log('from pomodoro timer error:', total / 1000)
            // todo: find better way to update timeRemaining
            // timeRemaing in this thread has different value
            // hence passing it as method parameter
            updatePomodoro('completed', 0);
            const audio = new Audio(process.env.PUBLIC_URL + '/audio/success-1-6297.mp3')
            audio.play();
        }
    }
    const refreshTimer = (endTime) => {

        // If you try to remove this line the 
        // updating of timer Variable will be
        // after 1000ms or 1sec
        if (Ref.current) clearInterval(Ref.current);
        const interval_id = setInterval(() => {
            // console.log(status, timeRemaining, endTime);
            if (status == 'completed') {
                clearInterval(interval_id);
            } else if (status == 'started') {
                updateTimer(endTime);
            }
        }, 1000)
        Ref.current = interval_id;
        return interval_id;
    }

    const getEndTime = () => {
        let endTime = new Date();

        // This is where you need to adjust if 
        // you entend to add more time
        endTime.setSeconds(endTime.getSeconds() + timeRemaining);
        return endTime;
    }

    // We can use useEffect so that when the component
    // mount the timer will start as soon as possible

    // We put empty array to act as componentDid
    // mount only
    useEffect(() => {
        const interval_id = refreshTimer(getEndTime());
        return () => {
            clearInterval(interval_id);  // fix for switching to different component
        };
    }, [status]);

    const updatePomodoro = (local_status, timeRemaining) => {
        setStatus(local_status)
        console.log("status updated to: ", local_status, timeRemaining, pomodoro)
        const pomodoro_data = {
            timeElapsed: pomodoro.length * 60 - timeRemaining,
            status: local_status  // // setState is not working for this synchronously
        }

        updatePomodoroApi(pomodoro.id, pomodoro_data)
            .then(response => {
                // console.log(response.status)
            })
            .catch(error => console.log(error))
    }

    const startAgain = () => {
        setPomodoro(null)
        createNewPomodoro(pomodoro.task)
    }

    return (
        <div className="PomodoroComponent">
            <div className="container">
                <small><i className="bi bi-folder-plus"> </i>{pomodoro.task.project.name}</small>
                <h5>{pomodoro.task.description}</h5>
                {
                    status != 'completed' &&
                    <div className="fs-1 p-3 mb-2 text-white" style={{ backgroundColor: pomodoro.task.project.color }}>
                        {timer}
                    </div>
                }

                {
                    status == 'started' && status != 'completed' &&
                    <div className="btn btn-warning m-4" onClick={() => updatePomodoro("paused", timeRemaining)}>Pause</div>
                }

                {
                    status == 'paused' && status != 'completed' &&
                    <div className="btn btn-success m-4" onClick={() => updatePomodoro("started", timeRemaining)}>Start</div>
                }

                {
                    status != 'completed' &&
                    <div className="btn btn-danger m-4" onClick={() => updatePomodoro("completed", timeRemaining)}>Mark Completed</div>
                }

                {
                    status == 'completed' &&
                    <BreakTimerComponent></BreakTimerComponent>
                }

                {
                    status == 'completed' &&
                    <div className="btn btn-outline-success m-4" onClick={() => setPomodoro(null)}>Return</div>
                }

                {
                    status == 'completed' &&
                    <div className="btn btn-outline-success m-4" onClick={startAgain}>Start Again</div>
                }
            </div>
        </div>
    )
}