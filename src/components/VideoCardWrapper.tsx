import React, {ReactNode} from "react"
import {
    IndexComponentProps,
    MainComponentProps,
    setVideoProps,
    Video,
    videoStatus
} from "../Interfaces";
import {NO_INTERVAL_SELECTED} from "./Editor";
import {updateVideoIndex} from "../App";
import '../styles/VideoCardWrapper.scss'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faX} from "@fortawesome/free-solid-svg-icons";


function VideoCard({ index, videoList, setVideoList, videoIndex, setVideoIndex }: IndexComponentProps) {
    const removeVideo = () => {
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

    interface TemplateProps {
        className: string,
        onClick?: Function
        children?: ReactNode
    }
    const Template = ({className, onClick = () => {}, children = <></>}: TemplateProps) => {
        return (
            <div className='card'>
                <div className={`cardMain ${className}`} onClick={() => onClick()}>
                    <div className="index">Video #{index + 1}</div>
                    <div className="title">{videoList[index].title}</div>
                    {children}
                </div>
                <button className={`delete customButton ${videoList[index].status !== videoStatus.EXPORTING ? 'enabledButton' : ''}`}
                        onClick={removeVideo}>
                    <FontAwesomeIcon icon={faX} />
                </button>
            </div>
        )
    }
    return (() => {
        switch (videoList[index].status) {
            case videoStatus.DOWNLOADING:
                return <Template className="downloadProgress">
                    <p>Downloading...</p>
                </Template>
            case videoStatus.DOWNLOAD_COMPLETE:
                return <Template className="downloadComplete" onClick={() => {
                    setVideoIndex(index)
                    setVideoProps("currentInterval", index, NO_INTERVAL_SELECTED, videoList, setVideoList)
                }}>
                    <p>Download complete</p>
                </Template>
            case videoStatus.DOWNLOAD_FAILED:
                return <Template className="downloadFailed">
                    <p>Download failed</p>
                </Template>
            case videoStatus.EXPORTING:
                return <Template className="exportProgress">
                    <p>Exporting...</p>
                </Template>
            case videoStatus.EXPORT_COMPLETE:
                return <Template className="exportComplete">
                    <p>Exporting Complete</p>
                </Template>
            default:
                return <></>
        }
    })()
}

export default function VideoCardWrapper(props: MainComponentProps) {
    const videoCards = props.videoList.map(
        (currentValue: Video, index: number) => <VideoCard index={index} {...props}/>
    )

    return (
        <div className="horizontal-scrolling-wrapper">
            {videoCards}
        </div>
    )
}
