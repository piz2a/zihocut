import ReactPlayer from "react-player"
import React, {useRef, useState} from "react"
import {Interval} from "./IntervalWrapper"
import {Video} from "./VideoCardWrapper"

function addInterval(
    intervalList: Interval[],
    setIntervalList: React.Dispatch<React.SetStateAction<Interval[]>>
) {
    setIntervalList([...intervalList, {from: Math.random().toString(), to: "1:00"}])
}

function Editor(props: {
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>
    intervalList: Interval[],
    setIntervalList: React.Dispatch<React.SetStateAction<Interval[]>>
}) {
    const [currentTime, setCurrentTime] = useState(0);
    const playerRef = useRef(null);
    const { ipcRenderer } = window.require('electron')
    const sendTest = async () => {
        console.log("haha" + await ipcRenderer.invoke('SEND_MAIN_PING', 'send'))
    }
    const handleProgress = (seconds: number) => {
        console.log(1)
        setCurrentTime(seconds)
    }
    return (
        <div className="editor">
            <ReactPlayer ref={playerRef}
                         url={props.videoList[0].id}
                         width="500px"
                         height="300px"
                         muted={true}
                         controls={true}
                         onSeek={handleProgress}/>
            <button onClick={() => addInterval(props.intervalList, props.setIntervalList)}>Add Interval</button>
            <button onClick={sendTest}>IPC Test</button>
            <button>{currentTime}</button>
        </div>
    )
}

export {Editor}