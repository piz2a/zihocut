import React from "react"
import {Interval, Video, setVideoProps} from "../Interfaces";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil, faX} from "@fortawesome/free-solid-svg-icons";
import {logStep} from "./Slider";
import '../styles/IntervalWrapper.scss'


function _0nd(x: number, n: number) {
    const len = 2 - Math.floor(x).toString().length + 1
    return len > 0 ? new Array(len).join('0') + x.toString() : x.toString()
}

export function minAndSec(time: number) {
    return `${_0nd(Math.floor(time / 60), 2)}:${_0nd(parseFloat((time % 60).toFixed(-logStep)), 2)}`
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
    if (videoList[videoIndex].currentInterval === -2) {
        const video = videoList[videoIndex]
        setVideoProps(
            "intervals",
            videoIndex,
            [...video.intervals.slice(0, index), ...video.intervals.slice(index + 1)],
            videoList,
            setVideoList
        )
    }
}

function IntervalComponent(
    index: number, t1: number, t2: number,
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>,
    videoIndex: number
) {
    return (
        <div className="interval">
            <span>{minAndSec(t1)} ~ {minAndSec(t2)}</span>
            <button className={`edit customButton ${videoList[videoIndex].currentInterval === -2 ? 'enabledButton' : ''}`}
                    onClick={() => editInterval(index, videoIndex, videoList, setVideoList)}>
                <FontAwesomeIcon icon={faPencil} />
            </button>
            <button className={`delete customButton ${videoList[videoIndex].currentInterval === -2 ? 'enabledButton' : ''}`}
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
        <div className="interval-wrapper prevent-select">
            {intervals.length !== 0 ?
                intervals :
                <div className="noInterval">
                    <h3>Add intervals below</h3>
                </div>
            }
        </div>
    )
}
