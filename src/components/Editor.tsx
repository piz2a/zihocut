import ReactPlayer from "react-player"
import React from "react"
import {Interval} from "./IntervalWrapper";

function addInterval(
    intervalList: Interval[],
    setIntervalList: React.Dispatch<React.SetStateAction<Interval[]>>
) {
    setIntervalList([...intervalList, {from: Math.random().toString(), to: "1:00"}])
}

function Editor(props: {
    videoURL: string,
    intervalList: Interval[],
    setIntervalList: React.Dispatch<React.SetStateAction<Interval[]>>
}) {
    return (
        <div className="editor">
            <ReactPlayer url={props.videoURL} width="500px" height="300px" muted={true} controls={true}/>
            <button onClick={() => addInterval(props.intervalList, props.setIntervalList)}>Add Interval</button>
        </div>
    )
}

export {Editor}