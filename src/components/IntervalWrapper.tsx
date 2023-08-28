import React from "react"
import {Interval, Video, setVideoProps} from "../Interfaces";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil, faX} from "@fortawesome/free-solid-svg-icons";
import {logStep} from "./Slider";


export function minAndSec(time: number) {
    return `${Math.floor(time / 60)}:${(time % 60).toFixed(-logStep)}`
}

function editInterval(
    index: number,
    videoIndex: number,
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>
) {
    if (videoList[videoIndex].currentInterval === -2) {
        setVideoProps(
            "currentInterval",
            videoIndex,
            index,
            videoList,
            setVideoList
        )
    }
}

function removeInterval(
    index: number,
    videoIndex: number,
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>
) {
    const video = videoList[videoIndex]
    setVideoProps(
        "intervals",
        videoIndex,
        [...video.intervals.slice(0, index), ...video.intervals.slice(index + 1)],
        videoList,
        setVideoList
    )
}

function IntervalComponent(
    index: number, t1: number, t2: number,
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>,
    videoIndex: number
) {
    return (
        <div className="interval">
            <span className="t1">{minAndSec(t1)}</span>
            <span className="to">~</span>
            <span className="t2">{minAndSec(t2)}</span>
            <button className={`edit customButton ${videoList[videoIndex].currentInterval === -2 ? 'enabledButton' : ''}`}
                    onClick={() => editInterval(index, videoIndex, videoList, setVideoList)}>
                <FontAwesomeIcon icon={faPencil} />
            </button>
            <button className="delete customButton"
                    onClick={() => removeInterval(index, videoIndex, videoList, setVideoList)}>
                <FontAwesomeIcon icon={faX} />
            </button>
        </div>
    )
}

export default function IntervalWrapper(props: {
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>,
    videoIndex: number
}) {
    const intervals = props.videoList[props.videoIndex].intervals.map(
        (currentValue: Interval, index: number) => IntervalComponent(
            index, currentValue.from, currentValue.to, props.videoList, props.setVideoList, props.videoIndex
        )
    )
    return (
        <div className="interval-wrapper">
            {intervals.length !== 0 ?
                intervals :
                <div className="noInterval">
                    <h3>Add Intervals Below</h3>
                </div>
            }
        </div>
    )
}
