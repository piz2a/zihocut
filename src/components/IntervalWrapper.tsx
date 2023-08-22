import React from "react"
import {Interval, Video, setVideoProps} from "../Interfaces";


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
    index: number, t1: string, t2: string,
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>,
    videoIndex: number
) {
    return (
        <div className="interval">
            <input type="text" className="t1" value={t1}/>
            <span>~</span>
            <input type="text" className="t2" value={t2}/>
            <button className="delete customButton"
                    onClick={() => removeInterval(index, videoIndex, videoList, setVideoList)}>
                X
            </button>
        </div>
    )
}

function IntervalWrapper(props: {
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
            {intervals}
        </div>
    )
}

export type {Interval}
export {IntervalWrapper}