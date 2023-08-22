import React from "react"
import {Video} from "../Interfaces";


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

function VideoCard(
    index: number,
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>) {
    return (
        <div className="card">
            <p className="title">{videoList[index].id}</p>
            {
                videoList[index].downloadComplete ?
                    DownloadCompleteBar() : DownloadProgressBar()
            }
            <button className="delete customButton"
                    onClick={() => removeVideo(index, videoList, setVideoList)}>
                X
            </button>
            <p>{videoList.toString()}</p>
        </div>
    )
}

function VideoCardWrapper(props: {
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>,
    videoIndex: number,
    setVideoIndex: React.Dispatch<React.SetStateAction<number>>
}) {
    const videoCards = props.videoList.map(
        (currentValue: Video, index: number) => VideoCard(
            index, props.videoList, props.setVideoList
        )
    )
    return (
        <div className="horizontal-scrolling-wrapper">
            {videoCards}
        </div>
    )
}

export type {Video}
export {VideoCardWrapper}