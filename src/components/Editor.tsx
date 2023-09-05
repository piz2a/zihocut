import ReactPlayer from "react-player"
import React, {useEffect, useRef, useState} from "react"
import {MainComponentProps, setVideoProps, Video, videoStatus} from "../Interfaces";
import Slider from "./Slider";
import IntervalWrapper from "./IntervalWrapper";
import {EnterButton, setDialog} from "./Dialog";
import '../styles/Editor.scss'
import '../styles/Footer.scss'

export const NEW_INTERVAL = -1
export const NO_INTERVAL_SELECTED = -2


function createInterval(
    videoIndex: number,
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>,
) {
    setVideoProps('currentInterval', videoIndex, NEW_INTERVAL, videoList, setVideoList)
}

function exportVideo( { videoList, setVideoList, videoIndex, setIsPopup, setCurrentDialog }: MainComponentProps) {
    if (videoList[videoIndex].currentInterval !== NO_INTERVAL_SELECTED) {
        setDialog(setIsPopup, setCurrentDialog, (
            <>
                <label>Save the current working interval or cancel it<br/>and try again.</label>
                <EnterButton onClick={() => setIsPopup(false)}>OK</EnterButton>
            </>
        ))
        return
    }
    if (videoList[videoIndex].intervals.length === 0) {
        setDialog(setIsPopup, setCurrentDialog, (
            <>
                <label>No intervals to trim.<br/>Add intervals and try again.</label>
                <EnterButton onClick={() => setIsPopup(false)}>OK</EnterButton>
            </>
        ))
        return
    }
    const { ipcRenderer } = window.require('electron')
    ipcRenderer.invoke('EXPORT_VIDEO', videoList[videoIndex].id, videoList[videoIndex].intervals.map((interval) => [interval.from, interval.to]))
    setVideoProps("status", videoIndex, videoStatus.EXPORTING, videoList, setVideoList)
}

export default function Editor(props: MainComponentProps) {
    const playerRef = useRef(null)
    const [playing, setPlaying] = useState(false)
    const [currentTime, setCurrentTime] = useState(0)
    const [videoDuration, setVideoDuration] = useState(0)
    const [videoPath, setVideoPath] = useState('')
    const { ipcRenderer } = window.require('electron')

    useEffect(() => {
        (async () => {
            setVideoPath(await ipcRenderer.invoke('GET_VIDEO_PATH'))
        })()
    })

    return (
        <>
            <div className="main">
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
                </div>
                <div className="vr"></div>
                <IntervalWrapper {...props}/>
            </div>
            <hr/>
            <div className="footer">
                <div className="sliderWrapper prevent-select">
                    {props.videoList[props.videoIndex].currentInterval === NO_INTERVAL_SELECTED ?
                        <>
                            <div className="slider"></div>
                            <div className="sliderButtonWrapper">
                                <button onClick={() => createInterval(props.videoIndex, props.videoList, props.setVideoList)}
                                        className="customButton newIntervalButton">
                                    New Interval
                                </button>
                            </div>
                        </> :
                        <>
                            <Slider playerRef={playerRef}
                                    max={videoDuration}
                                    currentTime={currentTime}
                                    playing={playing}
                                    setPlaying={setPlaying}
                                    {...props}/>
                        </>
                    }
                </div>
                <div className="bottomButtonWrapper prevent-select">
                    <button className={
                        `exportButton customButton ${props.videoList[props.videoIndex].currentInterval === NO_INTERVAL_SELECTED ? 'enabledButton' : ''}`
                    } onClick={() => exportVideo(props)}>
                        Export
                    </button>
                </div>
            </div>
        </>
    )
}
