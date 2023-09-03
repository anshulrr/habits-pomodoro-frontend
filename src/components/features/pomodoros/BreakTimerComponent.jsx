import { useEffect, useRef, useState } from 'react'

import { useAuth } from 'services/auth/AuthContext';
import { generateInitialTimer, calculateTimeRemaining, generateTimer } from 'services/helpers/timerHelper';

import StopwatchComponent from 'components/features/pomodoros/StopwatchComponent'

export default function BreakTimerComponent({ startAgain }) {
    const authContext = useAuth()
    const userSettings = authContext.userSettings

    const Ref = useRef(null);

    const [breakStatus, setBreakStatus] = useState(userSettings.enableAutoStartBreak ? 'break_start' : 'idle')

    const initialTimeRemaining = userSettings.breakLength * 60;

    const [breakTimer, setBreakTimer] = useState(generateInitialTimer(initialTimeRemaining));

    const [breakTimeRemaining, setBreakTimeRemaining] = useState(initialTimeRemaining);

    // without useState it is not passed to threads
    // const audio = new Audio('http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/pause.wav');
    // Todo: check why audio network call happened many times with useState
    const [audio, setAudio] = useState(null)

    const updateBreakTimer = (endTime) => {
        let { total, hours, minutes, seconds }
            = calculateTimeRemaining(endTime);
        if (total > 0) {

            // update the timer
            // check if less than 10 then we need to 
            // add '0' at the beginning of the variable
            setBreakTimer(generateTimer({ hours, minutes, seconds }))
            // console.debug(total / 1000)
            setBreakTimeRemaining(total / 1000);
        } else {
            // console.warn('from updateBreakTimer error:', total / 1000)
            // todo: find better way to update timeRemaining
            // timeRemaing in this thread has different value
            // hence passing it as method parameter
            updateBreak('break_finished')
        }
    }

    const refreshBreakTimer = (endTime) => {

        // If you try to remove this line the 
        // updating of timer Variable will be
        // after 1000ms or 1sec
        if (Ref.current) clearInterval(Ref.current);
        const interval_id = setInterval(() => {
            // console.debug('break ', breakStatus, breakTimeRemaining);
            if (breakStatus === 'break_started') {
                updateBreakTimer(endTime);
            } else if (breakStatus === 'break_finished') {
                clearInterval(interval_id);
            }
        }, 1000)
        Ref.current = interval_id;
        return interval_id;
    }

    const getBreakEndTime = () => {
        let endTime = new Date();

        // This is where you need to adjust if 
        // you entend to add more time
        endTime.setSeconds(endTime.getSeconds() + breakTimeRemaining);
        // console.debug(endTime);
        return endTime;
    }

    const updateBreak = (local_status) => {
        // console.debug(local_status);
        setBreakStatus(local_status);
        if (local_status === 'break_finished') {
            // console.debug(audio);
            if (userSettings.enableStopwatch && userSettings.enableStopwatchAudio) {
                const local_audio = new Audio(process.env.PUBLIC_URL + '/audio/ticking-clock_1-27477.mp3')
                local_audio.setAttribute('loop', true)
                local_audio.play()
                setAudio(local_audio)
            }
            setBreakStatus('break_stopwatch');
        }
    }

    useEffect(() => {
        // console.debug('re-render BreakTimerComponent')
        const id = refreshBreakTimer(getBreakEndTime());
        // console.debug('break status changed to ' + breakStatus)
        return () => {
            // console.debug('fix for switch to different component')
            clearInterval(id);  // fix for switching to different component
            if (breakStatus === 'break_stopwatch' && userSettings.enableStopwatch && userSettings.enableStopwatchAudio) {
                audio.pause();
            }
        };
    }, [breakStatus]); // eslint-disable-line react-hooks/exhaustive-deps


    return (
        <div className="BreakComponent">

            {
                breakStatus !== 'break_finished' && breakStatus !== 'break_stopwatch' &&
                <div className="fs-1 p-3 text-secondary" style={{ fontVariantNumeric: "tabular-nums" }}>
                    {breakTimer}
                </div>
            }

            {
                breakStatus === 'idle' &&
                <div className="btn btn-sm btn-success m-2" onClick={() => updateBreak('break_started')}>Start Break</div>
            }

            {
                breakStatus === 'break_started' &&
                <div className="btn btn-sm btn-secondary m-2" onClick={() => updateBreak('break_finished')}>Finish Break</div>
            }

            {
                <div className="btn btn-sm btn-outline-success m-2" onClick={startAgain}>Start Again</div>
            }

            {
                breakStatus === 'break_stopwatch' && userSettings.enableStopwatch &&
                < StopwatchComponent ></StopwatchComponent>
            }

        </div >
    )
}