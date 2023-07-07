import { useEffect, useRef, useState } from 'react'
import StopwatchComponent from './StopwatchComponent'

export default function BreakTimerComponent() {

    const Ref = useRef(null);

    // const [breakStatus, setBreakStatus] = useState('idle')
    const [breakStatus, setBreakStatus] = useState('break_started')

    const [breakTimer, setBreakTimer] = useState('5:00')

    const [breakTimeRemaining, setBreakTimeRemaining] = useState(5 * 60);

    // without useState it is not passed to threads
    // const audio = new Audio('http://codeskulptor-demos.commondatastorage.googleapis.com/GalaxyInvaders/pause.wav');
    // Todo: check why audio network call happened many times with useState
    const [audio, setAudio] = useState(null)

    const calculateTimeRemaining = (endTime) => {
        const total = Date.parse(endTime) - Date.parse(new Date());
        const seconds = Math.floor((total / 1000) % 60);
        const minutes = Math.floor((total / 1000 / 60) % 60);
        return {
            total, minutes, seconds
        };
    }

    const updateBreakTimer = (endTime) => {
        let { total, minutes, seconds }
            = calculateTimeRemaining(endTime);
        if (total > 0) {

            // update the timer
            // check if less than 10 then we need to 
            // add '0' at the beginning of the variable
            setBreakTimer(
                (minutes > 9 ? minutes : '0' + minutes) + ':'
                + (seconds > 9 ? seconds : '0' + seconds)
            )
            // console.log(total / 1000)
            setBreakTimeRemaining(total / 1000);
        } else {
            console.log('from updateBreakTimer error:', total / 1000)
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
            // console.log('break ', breakStatus, breakTimeRemaining);
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
        // console.log(endTime);
        return endTime;
    }

    const updateBreak = (local_status) => {
        // console.log(local_status);
        setBreakStatus(local_status);
        if (local_status === 'break_finished') {
            // console.log(audio);
            const local_audio = new Audio(process.env.PUBLIC_URL + '/audio/ticking-clock_1-27477.mp3')
            local_audio.setAttribute('loop', true)
            local_audio.play()
            setAudio(local_audio)
            setBreakStatus('break_timer');
        }
    }

    useEffect(() => {
        const id = refreshBreakTimer(getBreakEndTime());
        console.log('break status changed to ' + breakStatus)
        return () => {
            // console.log('fix for switch to different component')
            clearInterval(id);  // fix for switching to different component
            if (breakStatus === 'break_timer') {
                audio.pause();
            }
        };
    }, [breakStatus]);


    return (
        <div className="BreakComponent">
            <div className="container">

                <div>
                    {
                        breakStatus !== 'break_finished' && breakStatus !== 'break_timer'
                        &&
                        <div className="fs-1 p-3 mb-2 text-white" style={{ backgroundColor: 'grey' }}>
                            {breakTimer}
                        </div>
                    }
                    {
                        breakStatus === 'idle'
                        &&
                        <div>
                            <div className="btn btn-success m-4" onClick={() => updateBreak('break_started')}>Start Break</div>
                        </div>
                    }
                    {
                        breakStatus === 'break_started'
                        &&
                        <div>
                            <div className="btn btn-success m-4" onClick={() => updateBreak('break_finished')}>Finish Break</div>
                        </div>
                    }
                    {
                        breakStatus === 'break_timer'
                        &&
                        <div>
                            <StopwatchComponent></StopwatchComponent>
                        </div>
                    }
                </div>
            </div>

        </div>
    )
}