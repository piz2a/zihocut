import React, {JSX} from "react"
import {setVideoProps, Video, videoStatus} from "../Interfaces";
import {NO_INTERVAL_SELECTED} from "./Editor";
import {updateVideoIndex} from "../App";


function removeVideo(
    index: number,
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>,
    videoIndex: number,
    setVideoIndex: React.Dispatch<React.SetStateAction<number>>
) {
    if (videoList[index].status === videoStatus.EXPORTING)
        return
    videoList = [...videoList.slice(0, index), ...videoList.slice(index + 1)]
    setVideoList(videoList)
    console.log(videoList)
    if (videoIndex === index) {
        updateVideoIndex(videoList, setVideoList, videoIndex, setVideoIndex)
    } else if (videoIndex > index) {
        setVideoIndex(videoIndex - 1)
    } // if videoIndex < index: nothing to change
}

function DownloadProgress() {
    return (
        <>
            <progress value={50} max={100}></progress>
        </>
    )
}

function DownloadComplete(props: {
    index: number,
    setVideoIndex: React.Dispatch<React.SetStateAction<number>>,
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>
}) {
    return (
        <>
            <p>Download Complete</p>
            <button onClick={() => {
                props.setVideoIndex(props.index)
                setVideoProps("currentInterval", props.index, NO_INTERVAL_SELECTED, props.videoList, props.setVideoList)
            }}>Select</button>
        </>
    )
}

function DownloadFailed() {
    return (
        <>
            <p>Download Failed</p>
        </>
    )
}

function ExportProgress() {
    return (
        <>
            <p>Exporting...</p>
        </>
    )
}

function ExportComplete() {
    return (
        <>
            <p>Export Complete</p>
        </>
    )
}

function VideoCard(props: {
    index: number,
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>,
    videoIndex: number,
    setVideoIndex: React.Dispatch<React.SetStateAction<number>>,
    setIsPopup: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentDialog: React.Dispatch<React.SetStateAction<JSX.Element>>
}) {
    return (
        <div className="card">
            <p className="title">{props.videoList[props.index].id}</p>
            <div className="download">
                {(() => {
                    switch(props.videoList[props.index].status) {
                        case videoStatus.DOWNLOADING:
                            return <DownloadProgress/>
                        case videoStatus.DOWNLOAD_COMPLETE:
                            return <DownloadComplete index={props.index} setVideoIndex={props.setVideoIndex} videoList={props.videoList} setVideoList={props.setVideoList}/>
                        case videoStatus.DOWNLOAD_FAILED:
                            return <DownloadFailed/>
                        case videoStatus.EXPORTING:
                            return <ExportProgress/>
                        case videoStatus.EXPORT_COMPLETE:
                            return <ExportComplete/>
                    }
                })()}
            </div>
            <button className={`delete customButton ${props.videoList[props.index].status !== videoStatus.EXPORTING ? 'enabledButton' : ''}`}
                    onClick={() => removeVideo(props.index, props.videoList, props.setVideoList, props.videoIndex, props.setVideoIndex)}>
                X
            </button>
        </div>
    )
}

export default function VideoCardWrapper(props: {
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>,
    videoIndex: number,
    setVideoIndex: React.Dispatch<React.SetStateAction<number>>,
    setIsPopup: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentDialog: React.Dispatch<React.SetStateAction<JSX.Element>>
}) {
    const videoCards = props.videoList.map(
        (currentValue: Video, index: number) => <VideoCard index={index}
                                                           videoList={props.videoList}
                                                           setVideoList={props.setVideoList}
                                                           videoIndex={props.videoIndex}
                                                           setVideoIndex={props.setVideoIndex}
                                                           setIsPopup={props.setIsPopup}
                                                           setCurrentDialog={props.setCurrentDialog}/>
    )

    return (
        <div className="horizontal-scrolling-wrapper">
            {videoCards}
        </div>
    )
}
