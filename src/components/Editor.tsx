import ReactPlayer from "react-player"
import React, {useRef, useState} from "react"
import {setVideoProps, Video} from "../Interfaces";
import Slider from "./Slider";

function addInterval(
    videoIndex: number,
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>
) {
    setVideoProps(
        "intervals",
        videoIndex,
        [...videoList[videoIndex].intervals, {from: Math.random().toString(), to: "1:00"}],
        videoList,
        setVideoList
    )
}

function Editor(props: {
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>,
    videoIndex: number,
    setVideoIndex: React.Dispatch<React.SetStateAction<number>>
}) {
    const [currentTime, setCurrentTime] = useState(0);
    const playerRef = useRef(null);
    const { ipcRenderer } = window.require('electron')
    const sendTest = async () => {
        console.log("haha" + await ipcRenderer.invoke('QUEUE_VIDEO', 'jNQXAC9IVRw'))
    }
    const handleProgress = (seconds: number) => {
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
            <button onClick={() => addInterval(props.videoIndex, props.videoList, props.setVideoList)}>Add Interval</button>
            <button onClick={sendTest}>IPC Test</button>
            <button>{currentTime}</button>
            <Slider/>
        </div>
    )
}

export {Editor}