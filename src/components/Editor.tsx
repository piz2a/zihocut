import ReactPlayer from "react-player"
import React, {JSX, useEffect, useRef, useState} from "react"
import {setVideoProps, Video, videoStatus} from "../Interfaces";
import Slider from "./Slider";
import IntervalWrapper from "./IntervalWrapper";
import {setDialog} from "../App";

export const NEW_INTERVAL = -1
export const NO_INTERVAL_SELECTED = -2


function createInterval(
    videoIndex: number,
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>,
) {
    setVideoProps('currentInterval', videoIndex, NEW_INTERVAL, videoList, setVideoList)
}

function exportVideo(
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>,
    videoIndex: number,
    setVideoIndex: React.Dispatch<React.SetStateAction<number>>,
    setIsPopup: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentDialog: React.Dispatch<React.SetStateAction<JSX.Element>>
) {
    if (videoList[videoIndex].currentInterval !== NO_INTERVAL_SELECTED) {
        setDialog(setIsPopup, setCurrentDialog, (
            <dialog open>
                <button onClick={() => setIsPopup(false)} id="closeButton">X</button>
                <label>Save the current working interval or cancel it<br/>and try again.</label>
                <button onClick={() => setIsPopup(false)} id="enterButton">OK</button>
            </dialog>
        ))
        return
    }
    if (videoList[videoIndex].intervals.length === 0) {
        setDialog(setIsPopup, setCurrentDialog, (
            <dialog open>
                <button onClick={() => setIsPopup(false)} id="closeButton">X</button>
                <label>No intervals to trim.<br/>Add intervals and try again.</label>
                <button onClick={() => setIsPopup(false)} id="enterButton">OK</button>
            </dialog>
        ))
        return
    }
    const { ipcRenderer } = window.require('electron')
    ipcRenderer.invoke('EXPORT_VIDEO', videoList[videoIndex].id, videoList[videoIndex].intervals.map((interval) => [interval.from, interval.to]))
    setVideoProps("status", videoIndex, videoStatus.EXPORTING, videoList, setVideoList)
}

export default function Editor(props: {
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>,
    videoIndex: number,
    setVideoIndex: React.Dispatch<React.SetStateAction<number>>,
    setIsPopup: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentDialog: React.Dispatch<React.SetStateAction<JSX.Element>>
}) {
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
                <IntervalWrapper videoList={props.videoList}
                                 setVideoList={props.setVideoList}
                                 videoIndex={props.videoIndex}/>
            </div>
            <hr/>
            <div className="footer">
                <div className="sliderWrapper">
                    {props.videoList[props.videoIndex].currentInterval === NO_INTERVAL_SELECTED ?
                        <>
                            <button onClick={() => createInterval(props.videoIndex, props.videoList, props.setVideoList)}>
                                New Interval
                            </button>
                        </> :
                        <>
                            <Slider playerRef={playerRef}
                                    max={videoDuration}
                                    currentTime={currentTime}
                                    playing={playing}
                                    setPlaying={setPlaying}
                                    videoList={props.videoList}
                                    setVideoList={props.setVideoList}
                                    videoIndex={props.videoIndex}
                                    setVideoIndex={props.setVideoIndex}/>
                        </>
                    }
                </div>
                <div className="bottomButtonWrapper">
                    <button className={
                        `exportButton ${props.videoList[props.videoIndex].currentInterval === NO_INTERVAL_SELECTED ? 'enabledButton' : ''}`
                    } onClick={() => exportVideo(props.videoList, props.setVideoList, props.videoIndex, props.setVideoIndex, props.setIsPopup, props.setCurrentDialog)}>
                        Export
                    </button>
                </div>
            </div>
        </>
    )
}
