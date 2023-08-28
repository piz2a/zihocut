import React, {JSX, useEffect} from "react"
import {setVideoProps, Video, videoStatus} from "../Interfaces";
import {setDialog} from "../App";


function removeVideo(
    index: number,
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>,
    setVideoIndex: React.Dispatch<React.SetStateAction<number>>
) {
    if (videoList[index].status === videoStatus.EXPORTING)
        return
    if (index >= videoList.length - 1)
        setVideoIndex(-1)
    setVideoList([...videoList.slice(0, index), ...videoList.slice(index + 1)])
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
    setVideoIndex: React.Dispatch<React.SetStateAction<number>>
}) {
    return (
        <>
            <p>Download Complete</p>
            <button onClick={() => props.setVideoIndex(props.index)}>Select</button>
        </>
    )
}

function ExportProgress() {
    return (
        <>
            <p>Exporting</p>
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

function ExportFailed() {
    return (
        <>
            <p>Export Failed</p>
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
    const { ipcRenderer } = window.require('electron')

    useEffect(() => {
        ipcRenderer.on('DOWNLOAD_COMPLETE', (event: any, message: {id: string, complete: boolean}) => {
            if (message.complete) {
                if (message.id === props.videoList[props.index].id)
                    setVideoProps("status", props.index, videoStatus.DOWNLOAD_COMPLETE, props.videoList, props.setVideoList)
                if (props.videoIndex === -1) {
                    props.setVideoIndex(0)
                }
            } else {
                setDialog(props.setIsPopup, props.setCurrentDialog, (
                    <dialog open>
                        <button onClick={() => props.setIsPopup(false)} id="closeButton">X</button>
                        <label>Download failed: {message.id}</label>
                        <button onClick={() => props.setIsPopup(false)} id="enterButton">OK</button>
                    </dialog>
                ))
            }
        })
    }, [])

    return (
        <div className="card">
            <p className="title">{props.videoList[props.index].id}</p>
            <div className="download">
                {(() => {
                    switch(props.videoList[props.index].status) {
                        case videoStatus.DOWNLOADING:
                            return <DownloadProgress/>
                        case videoStatus.DOWNLOAD_COMPLETE:
                            return <DownloadComplete index={props.index} setVideoIndex={props.setVideoIndex}/>
                        case videoStatus.EXPORTING:
                            return <ExportProgress/>
                        case videoStatus.EXPORT_COMPLETE:
                            return <ExportComplete/>
                        case videoStatus.EXPORT_FAILED:
                            return <ExportFailed/>
                    }
                })()}
            </div>
            <button className={`delete customButton ${props.videoList[props.index].status !== videoStatus.EXPORTING ? 'enabledButton' : ''}`}
                    onClick={() => removeVideo(props.index, props.videoList, props.setVideoList, props.setVideoIndex)}>
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
