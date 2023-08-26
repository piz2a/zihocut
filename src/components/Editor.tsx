import ReactPlayer from "react-player"
import React, {useEffect, useRef, useState} from "react"
import {setVideoProps, Video} from "../Interfaces";
import Slider, {getSliderValue} from "./Slider";

function addInterval(
    videoIndex: number,
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>,
    from: number,
    to: number
) {
    setVideoProps(
        "intervals",
        videoIndex,
        [...videoList[videoIndex].intervals, { from: from.toString(), to: to.toString() }],
        videoList,
        setVideoList
    )
}

export default function Editor(props: {
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>,
    videoIndex: number,
    setVideoIndex: React.Dispatch<React.SetStateAction<number>>
}) {
    const playerRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [videoDuration, setVideoDuration] = useState(0);
    const [videoPath, setVideoPath] = useState('')
    const { ipcRenderer } = window.require('electron')

    useEffect(() => {
        (async () => {
            setVideoPath(await ipcRenderer.invoke('GET_VIDEO_PATH'))
        })()
    })

    return (
        <div className="editor">
            <ReactPlayer ref={playerRef}
                         url={`${videoPath}/${props.videoList[props.videoIndex].id}.mp4`}
                         width="500px"
                         height="300px"
                         muted={true}
                         controls
                         onDuration={setVideoDuration}
                         config={{
                             file: {
                                 attributes: {
                                     controlsList: "nofullscreen"
                                 }
                             }
                         }}
                         onSeek={setCurrentTime}
                         onProgress={(progress) => setCurrentTime(progress.playedSeconds)}/>
            <button onClick={() => addInterval(props.videoIndex, props.videoList, props.setVideoList, getSliderValue(0), getSliderValue(1))}>Add Interval</button>
            <button>{currentTime}</button>
            <Slider playerRef={playerRef} max={videoDuration} currentTime={currentTime}/>
        </div>
    )
}
