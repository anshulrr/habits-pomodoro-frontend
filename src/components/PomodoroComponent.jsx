import { useEffect, useRef, useState } from 'react'
// import { useParams, useLocation, Link } from 'react-router-dom';
import { updatePomodoroApi } from '../services/api/PomodoroApiService';
import BreakTimerComponent from './BreakTimerComponent';

export default function PomodoroComponent({ pomodoro, setPomodoro, createNewPomodoro, setTasksMessage }) {

    // We need ref in this, because we are dealing
    // with JS setInterval to keep track of it and
    // stop it when needed
    const Ref = useRef(null);

    // const { task_id, pomodoro.id, pomodoro.length } = useParams()
    // const { state } = useLocation();


    const [openPipWindow, setOpenPipWindow] = useState(false)

    const [pipWindow, setPipWindow] = useState(null)

    const initialTimeRemaining = pomodoro.length * 60 - pomodoro.timeElapsed;
    const hours = parseInt(initialTimeRemaining / 60 / 60) % 24;
    const minutes = parseInt(initialTimeRemaining / 60) % 60;
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
            if (status === 'completed') {
                clearInterval(interval_id);
                pipWindow.close();
                setPipWindow(null);
            } else if (status === 'started') {
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
        // console.log('re-render PomodorosComponents', interval_id)
        return () => {
            clearInterval(interval_id);  // fix for switching to different component
        };
    }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

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
                if (local_status === 'completed') {
                    setTasksMessage('');
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

    async function openPip() {
        const player = document.querySelector("#pomodoro-player");
        // Open a Picture-in-Picture window.
        const pipWindow = await window.documentPictureInPicture.requestWindow({
            width: 120,
            height: 120,
        });
        // Move the player to the Picture-in-Picture window.
        pipWindow.document.body.append(player);

        setOpenPipWindow(true);
        setPipWindow(pipWindow);

        pipWindow.addEventListener("pagehide", (event) => {
            setOpenPipWindow(false);
            const playerContainer = document.querySelector("#pomodoro-player-container");
            const pipPlayer = event.target.querySelector("#pomodoro-player");
            playerContainer.append(pipPlayer);
        });
    }

    return (
        <div id="pomodoro-player-container" className="PomodoroComponent">
            <div className="" id="pomodoro-player">
                {
                    openPipWindow &&
                    <div className="row">
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossOrigin="anonymous" />
                        <div className="col-12 text-center">
                            <small><i className="bi bi-folder-plus"> </i>{pomodoro.task.project.name}</small>
                            <h6>{pomodoro.task.description}</h6>
                            {
                                status !== 'completed' &&
                                <div className="fs-1 p-3 text-white" style={{ backgroundColor: pomodoro.task.project.color }}>
                                    {timer}
                                </div>
                            }
                        </div>
                    </div>
                }
            </div>

            <div>
                <div className="mx-1" style={{ position: "relative" }}>
                    <small>
                        <i className="bi bi-folder-plus" style={{ cursor: "text" }} />
                        <span> {pomodoro.task.project.name} </span>
                    </small>
                    {
                        'documentPictureInPicture' in window && !openPipWindow &&
                        <span style={{ position: "absolute", right: 0 }}>
                            <i className="bi bi-pip" onClick={openPip} />
                        </span>
                    }
                </div>
                <h5>{pomodoro.task.description}</h5>
                {
                    status !== 'completed' &&
                    <div className="fs-1 p-3 text-white" style={{ backgroundColor: pomodoro.task.project.color, fontVariantNumeric: "tabular-nums" }}>
                        {timer}
                    </div>
                }

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