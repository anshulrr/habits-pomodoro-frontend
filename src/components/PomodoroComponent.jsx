import { useEffect, useRef, useState } from 'react'
// import { useParams, useLocation, Link } from 'react-router-dom';
import { updatePomodoroApi } from '../services/api/PomodoroApiService';
import BreakTimerComponent from './BreakTimerComponent';

export default function PomodoroComponent({ pomodoro, setPomodoro, setPomodoroStatus, createNewPomodoro, setTasksMessage }) {

    // We need ref in this, because we are dealing
    // with JS setInterval to keep track of it and
    // stop it when needed
    const intervalRef = useRef(null);

    const initialTimeRemaining = pomodoro.length * 60 - pomodoro.timeElapsed;
    const hours = Math.floor(initialTimeRemaining / 60 / 60) % 24;
    const minutes = Math.floor(initialTimeRemaining / 60) % 60;
    const seconds = initialTimeRemaining % 60;

    const [timer, setTimer] = useState(
        (hours > 9 ? hours : '0' + hours) + ':' +
        (minutes > 9 ? minutes : '0' + minutes) + ':' +
        (seconds > 9 ? seconds : '0' + seconds)
    )
    // console.log(timer);

    const [timeRemaining, setTimeRemaining] = useState(initialTimeRemaining)

    const [status, setStatus] = useState(pomodoro.status)

    const calculateTimeRemaining = (endTime) => {
        const total = Date.parse(endTime) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        const hours = Math.floor((total / 1000 / 60 / 60) % 24);
        return {
            total, hours, minutes, seconds
        };
    }

    const updateTimer = (endTime) => {
        let { total, hours, minutes, seconds }
            = calculateTimeRemaining(endTime);
        if (total > 0) {

            // update the timer
            // check if less than 10 then we need to 
            // add '0' at the beginning of the variable
            setTimer(
                (hours > 9 ? hours : '0' + hours) + ':' +
                (minutes > 9 ? minutes : '0' + minutes) + ':' +
                (seconds > 9 ? seconds : '0' + seconds)
            )
            // console.log(timeRemaining, total / 1000)
            setTimeRemaining(total / 1000);
            // temp fix to keep service worker alive
            if ((total / 1000) % 20 === 0) {
                navigator.serviceWorker.ready.then((registration) => {
                    registration.active.postMessage('keep alive')
                })
            }
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
        console.log("interval id:", intervalRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
        const interval_id = setInterval(() => {
            // console.log(status, timeRemaining, endTime);
            if (status === 'completed') {
                console.log('status is updated to completed by user')
                clearInterval(interval_id);
            } else if (status === 'started') {
                updateTimer(endTime);
            }
        }, 1000)
        intervalRef.current = interval_id;
        return interval_id;
    }

    const getEndTime = () => {
        let endTime = new Date();

        // This is where you need to adjust if 
        // you entend to add more time
        endTime.setSeconds(endTime.getSeconds() + timeRemaining);
        return endTime;
    }

    useEffect(() => {
        notificationSetup()
    }, []);

    // We can use useEffect so that when the component
    // mount the timer will start as soon as possible

    // We put empty array to act as componentDid
    // mount only
    useEffect(() => {
        const interval_id = refreshTimer(getEndTime());
        // console.log('re-render PomodorosComponents', interval_id)
        return () => {
            clearInterval(interval_id);  // fix for switching to different component
        };
    }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

    const updatePomodoro = (local_status, timeRemaining) => {
        setStatus(local_status)
        console.log("status updated to: ", local_status, timeRemaining)
        const pomodoro_data = {
            timeElapsed: pomodoro.length * 60 - timeRemaining,
            status: local_status  // // setState is not working for this synchronously
        }

        updatePomodoroApi(pomodoro.id, pomodoro_data)
            .then(response => {
                // console.log(response.status)
                if (local_status === 'completed') {
                    setTasksMessage('');
                    setPomodoroStatus('completed');
                }

                navigator.serviceWorker.ready.then((registration) => {
                    // console.log('using postMessage')
                    registration.active.postMessage({
                        timeRemaining: timeRemaining,
                        task: pomodoro.task.description,
                        status: local_status
                    })
                })
            })
            .catch(error => {
                console.error(error.message)
                setPomodoro(null)
            })
    }

    const startAgain = () => {
        setPomodoro(null)
        createNewPomodoro(pomodoro.task, pomodoro.task.project, true)
    }

    function notificationSetup() {
        Notification.requestPermission().then((result) => {
            if (result === "granted") {
                initializeNotification()
            } else if (Notification.permission !== "denied") {
                // We need to ask the user for permission
                Notification.requestPermission().then((permission) => {
                    if (permission === "granted") {
                        console.log('got the permission for notifications')
                    }
                });
            }
        })
    }

    function initializeNotification() {
        console.log('init notification')
        navigator.serviceWorker.ready.then((registration) => {
            // console.log('using postMessage')
            registration.active.postMessage({
                timeRemaining: timeRemaining,
                task: pomodoro.task.description,
                status: status
            })
        })
    }

    function testingWorkerTimer() {
        const options = {
            vibrate: [500, 110, 500, 110, 450, 110, 200, 110, 170, 40, 450, 110, 200, 110, 170, 40, 500]
        };
        navigator.serviceWorker.ready.then((registration) => {
            registration.active.postMessage({
                timeRemaining: -1,
                task: 'testing web worker',
                status: 'started'
            }, options)
        })
    }

    return (
        <div className="PomodoroComponent">
            <div className="container">
                <small><i className="bi bi-folder-plus"> </i>{pomodoro.task.project.name}</small>
                <h5>{pomodoro.task.description}</h5>
                {
                    status !== 'completed' &&
                    <div className="fs-1 p-3 text-white" style={{ backgroundColor: pomodoro.task.project.color, fontVariantNumeric: "tabular-nums" }}>
                        {timer}
                    </div>
                }

                {/* for testing purpose only */}
                <button className="btn btn-sm btn-secondary m-2" onClick={testingWorkerTimer}>Test Web Worker</button>

                {
                    status === 'started' && status !== 'completed' &&
                    <div className="btn btn-sm btn-warning m-2" onClick={() => updatePomodoro("paused", timeRemaining)}>Pause</div>
                }

                {
                    status === 'paused' && status !== 'completed' &&
                    <div className="btn btn-sm btn-success m-2" onClick={() => updatePomodoro("started", timeRemaining)}>Start</div>
                }

                {
                    status !== 'completed' &&
                    <div className="btn btn-sm btn-danger m-2" onClick={() => updatePomodoro("completed", timeRemaining)}>Mark Completed</div>
                }

                {
                    status === 'completed' &&
                    <div className="btn btn-sm btn-outline-success m-2" onClick={() => setPomodoro(null)}>Return</div>
                }

                {
                    status === 'completed' &&
                    <div className="btn btn-sm btn-outline-success m-2" onClick={startAgain}>Start Again</div>
                }

                {
                    status === 'completed' &&
                    <BreakTimerComponent></BreakTimerComponent>
                }
            </div>
        </div>
    )
}