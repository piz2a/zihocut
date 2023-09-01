import React, {JSX, ReactNode} from "react"
import {setVideoProps, Video, videoStatus} from "../Interfaces";
import {NO_INTERVAL_SELECTED} from "./Editor";
import {updateVideoIndex} from "../App";
import '../styles/VideoCardWrapper.scss'
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faX} from "@fortawesome/free-solid-svg-icons";


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

function VideoCard(props: {
    index: number,
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>,
    videoIndex: number,
    setVideoIndex: React.Dispatch<React.SetStateAction<number>>,
    setIsPopup: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentDialog: React.Dispatch<React.SetStateAction<JSX.Element>>
}) {
    const videoCardProps = props
    interface TemplateProps {
        className: string,
        onClick?: Function
        children?: ReactNode
    }
    const Template = ({className, onClick = () => {}, children = <></>}: TemplateProps) => {
        return (
            <div className='card'>
                <div className={`cardMain ${className}`} onClick={() => onClick()}>
                    <div className="index">Video #{videoCardProps.index + 1}</div>
                    <div className="title">{videoCardProps.videoList[videoCardProps.index].title}</div>
                    {children}
                </div>
                <button className={`delete customButton ${videoCardProps.videoList[videoCardProps.index].status !== videoStatus.EXPORTING ? 'enabledButton' : ''}`}
                        onClick={() => removeVideo(
                            videoCardProps.index,
                            videoCardProps.videoList,
                            videoCardProps.setVideoList,
                            videoCardProps.videoIndex,
                            videoCardProps.setVideoIndex
                        )}>
                    <FontAwesomeIcon icon={faX} />
                </button>
            </div>
        )
    }
    return (() => {
        switch (props.videoList[props.index].status) {
            case videoStatus.DOWNLOADING:
                return <Template className="downloadProgress">
                    <p>Downloading...</p>
                </Template>
            case videoStatus.DOWNLOAD_COMPLETE:
                return <Template className="downloadComplete" onClick={() => {
                    props.setVideoIndex(props.index)
                    setVideoProps("currentInterval", props.index, NO_INTERVAL_SELECTED, props.videoList, props.setVideoList)
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
