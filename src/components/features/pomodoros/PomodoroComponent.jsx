import { useEffect, useRef, useState } from 'react'
// import { useParams, useLocation, Link } from 'react-router-dom';

import { useAuth } from 'services/auth/AuthContext';
import { updatePomodoroApi } from 'services/api/PomodoroApiService';
import { generateInitialTimer, calculateTimeRemaining, generateTimer } from 'services/helpers/timerHelper';

import BreakTimerComponent from 'components/features/pomodoros/BreakTimerComponent';
import ListCommentsComponent from '../comments/ListCommentsComponent';

export default function PomodoroComponent({
    pomodoro,
    setPomodoro,
    setPomodoroStatus,
    createNewPomodoro,
    setTasksMessage,
    setPomodorosListReload
}) {
    const authContext = useAuth()
    const userSettings = authContext.userSettings

    // We need ref in this, because we are dealing
    // with JS setInterval to keep track of it and
    // stop it when needed
    const intervalRef = useRef(null);

    const [openPomodoroPopup, setOpenPomodorosPopup] = useState(userSettings.enableAutoTimerFullscreen ? true : false)

    const [showCommentsId, setShowCommentsId] = useState(-1);

    const [status, setStatus] = useState(pomodoro.status)

    const initialTimeRemaining = pomodoro.length * 60 - pomodoro.timeElapsed;

    const [timer, setTimer] = useState(generateInitialTimer(initialTimeRemaining))

    const [timeRemaining, setTimeRemaining] = useState(initialTimeRemaining)

    const updateTimer = (endTime) => {
        let { total, hours, minutes, seconds }
            = calculateTimeRemaining(endTime);
        if (total > 0) {

            // update the timer
            // check if less than 10 then we need to 
            // add '0' at the beginning of the variable
            let updatedTimer = generateTimer({ hours, minutes, seconds });
            setTimer(updatedTimer)

            // console.debug(timeRemaining, total / 1000)
            setTimeRemaining(total / 1000);
            // // temp fix to keep service worker alive
            // // (no effect) (works only for few more seconds until page is awake)
            // if ((total / 1000) % 20 === 0) {
            //     navigator.serviceWorker.ready.then((registration) => {
            //         registration.active.postMessage('keep alive')
            //     })
            // }
            // document.title = 'Habits Pomodoro - ' + updatedTimer;
        } else {
            // TODO: find fix for extra seconds elapsed due to inactive tab
            // console.warn('from pomodoro timer error:', total / 1000)
            // todo: find better way to update timeRemaining
            // timeRemaing in this thread has different value
            // hence passing it as method parameter
            updatePomodoro('completed', 0);
            const audio = new Audio(process.env.PUBLIC_URL + '/audio/success-1-6297.mp3')
            audio.play();
            // document.title = 'Habits Pomodoro';
        }
    }
    const refreshTimer = (endTime) => {

        // If you try to remove this line the 
        // updating of timer Variable will be
        // after 1000ms or 1sec
        // console.debug("interval id:", intervalRef.current);
        if (intervalRef.current) clearInterval(intervalRef.current);
        const interval_id = setInterval(() => {
            // console.debug(status, timeRemaining, endTime);
            if (status === 'completed') {
                // console.debug('status is updated to completed by user')
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
        if ("serviceWorker" in navigator && !navigator?.userAgentData?.mobile) {
            notificationSetup()
        }
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // We can use useEffect so that when the component
    // mount the timer will start as soon as possible

    // We put empty array to act as componentDid
    // mount only
    useEffect(() => {
        const interval_id = refreshTimer(getEndTime());
        // console.debug('re-render PomodorosComponents', interval_id)
        return () => {
            clearInterval(interval_id);  // fix for switching to different component
        };
    }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

    const updatePomodoro = (local_status, timeRemaining) => {
        setStatus(local_status)
        // console.debug("status updated to: ", local_status, timeRemaining)
        const pomodoro_data = {
            timeElapsed: pomodoro.length * 60 - timeRemaining,
            status: local_status  // // setState is not working for this synchronously
        }

        updatePomodoroApi(pomodoro.id, pomodoro_data)
            .then(response => {
                // console.debug(response.status)
                if (local_status === 'completed') {
                    setTasksMessage('');
                    setPomodoroStatus('completed');
                    setPomodorosListReload(prevReload => prevReload + 1)
                }

                if ("serviceWorker" in navigator && !navigator?.userAgentData?.mobile) {
                    navigator.serviceWorker.ready.then((registration) => {
                        // console.debug('using postMessage')
                        registration.active.postMessage({
                            timeRemaining: timeRemaining,
                            task: pomodoro.task.description,
                            status: local_status
                        })
                    })
                }
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
                        console.info('got the permission for notifications')
                    }
                });
            }
        })
    }

    function initializeNotification() {
        if ("serviceWorker" in navigator && !navigator?.userAgentData?.mobile) {
            // console.debug('init notification')
            navigator.serviceWorker.ready.then((registration) => {
                // console.debug('using postMessage')
                registration.active.postMessage({
                    timeRemaining: timeRemaining,
                    task: pomodoro.task.description,
                    status: status
                })
            })
        }
    }

    function updateCommentsData(pomodoro) {
        setShowCommentsId(pomodoro.task.id)

        // minimise popup to footer
        setOpenPomodorosPopup(false)
    }

    function handleDobuleClick(e) {
        if (e.detail === 2) {
            setOpenPomodorosPopup(!openPomodoroPopup)
        }
    }

    return (
        <div className="PomodoroComponent" onClick={(e) => handleDobuleClick(e)}>
            <div className={openPomodoroPopup ? "timer-overlay" : ""}>
                <div className={openPomodoroPopup ? "timer-popup py-2 px-0 container" : "timer-bottom"}>
                    <span className="pe-1" style={{ color: pomodoro.task.project.color }}>&#9632;</span>
                    <small>
                        {pomodoro.task.project.name}
                    </small>
                    <h5>
                        <span className="badge rounded-pill text-bg-light">
                            <i className="bi bi-list-ul" />
                        </span>
                        {pomodoro.task.description}
                        <button type="button" className="btn btn-sm btn-outline-secondary ms-1 py-0 px-1" onClick={() => updateCommentsData(pomodoro)}>
                            <i className="bi bi-journal-text" />
                        </button>
                    </h5>
                    <div className="fullscreen-button">
                        <i className={"btn btn-sm btn-outline-secondary py-0 px-1 " + (openPomodoroPopup ? "bi bi-fullscreen-exit" : "bi bi-fullscreen")} onClick={() => setOpenPomodorosPopup(!openPomodoroPopup)} />
                    </div>
                    {
                        status !== 'completed' &&
                        <div className="text-white timer noselect" style={{ backgroundColor: pomodoro.task.project.color, fontVariantNumeric: "tabular-nums" }}>
                            {timer}
                        </div>
                    }

                    {
                        status === 'started' &&
                        <div className="btn btn-sm btn-warning m-2" onClick={() => updatePomodoro("paused", timeRemaining)}>Pause</div>
                    }

                    {
                        status === 'paused' &&
                        <div className="btn btn-sm btn-success m-2" onClick={() => updatePomodoro("started", timeRemaining)}>Continue</div>
                    }

                    {
                        status !== 'completed' &&
                        <div className="btn btn-sm btn-danger m-2" onClick={() => updatePomodoro("completed", timeRemaining)}>Finish</div>
                    }

                    {
                        status === 'completed' &&
                        <BreakTimerComponent
                            startAgain={startAgain}
                        />
                    }
                </div>
            </div>

            {
                showCommentsId !== -1 &&
                <div className="comments-overlay">
                    <div className="comments-popup">
                        <div className="close-popup m-2">
                            <i className="p-1 bi bi-x-lg" onClick={() => setShowCommentsId(-1)}></i>
                        </div>
                        <div className="container mt-4">
                            <ListCommentsComponent
                                filterBy={'task'}
                                id={showCommentsId}
                            />
                        </div >
                    </div>
                </div>
            }
        </div >
    )
}