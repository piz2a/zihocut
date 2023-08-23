import React, {JSX, useEffect} from "react"
import {Video} from "../Interfaces";
import {setDialog} from "../App";


function removeVideo(
    index: number,
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>
) {
    setVideoList([...videoList.slice(0, index), ...videoList.slice(index + 1)])
}

function DownloadProgressBar() {
    return <div className="download">
        <progress value={50} max={100}></progress>
    </div>
}

function DownloadCompleteBar() {
    return <div className="download"></div>
}

function VideoCard(props: {
    index: number,
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>,
    setIsPopup: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentDialog: React.Dispatch<React.SetStateAction<JSX.Element>>
}) {
    const { ipcRenderer } = window.require('electron')
    useEffect(() => {
        ipcRenderer.on('DOWNLOAD_COMPLETE', (event: any, message: {id: string, complete: boolean}) => {
            if (message.complete) {
                props.setVideoList(props.videoList.map((video) => {
                    if (video.id === message.id) {
                        video.downloadComplete = true
                    }
                    return video
                }))
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
            {
                props.videoList[props.index].downloadComplete ?
                    DownloadCompleteBar() : DownloadProgressBar()
            }
            <button className="delete customButton"
                    onClick={() => removeVideo(props.index, props.videoList, props.setVideoList)}>
                X
            </button>
            <p>{props.videoList.toString()}</p>
        </div>
    )
}

function VideoCardWrapper(props: {
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>,
    videoIndex: number,
    setVideoIndex: React.Dispatch<React.SetStateAction<number>>,
    setIsPopup: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentDialog: React.Dispatch<React.SetStateAction<JSX.Element>>
}) {
    const videoCards = props.videoList.map(
        (currentValue: Video, index: number) => <VideoCard index={index} videoList={props.videoList} setVideoList={props.setVideoList} setIsPopup={props.setIsPopup} setCurrentDialog={props.setCurrentDialog}/>
    )
    return (
        <div className="horizontal-scrolling-wrapper">
            {videoCards}
        </div>
    )
}

export type {Video}
export {VideoCardWrapper}