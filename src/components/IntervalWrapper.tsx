import React from "react"
import {Interval, setVideoProps, IndexComponentProps, MainComponentProps} from "../Interfaces";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPencil, faX} from "@fortawesome/free-solid-svg-icons";
import {logStep} from "./Slider";
import '../styles/IntervalWrapper.scss'


function _0nd(x: number, n: number) {
    const len = n - Math.floor(x).toString().length + 1
    return len > 0 ? new Array(len).join('0') + x.toString() : x.toString()
}

export function minAndSec(time: number) {
    return `${_0nd(Math.floor(time / 60), 2)}:${_0nd(parseFloat((time % 60).toFixed(-logStep)), 2)}`
}


interface IntervalComponentProps extends IndexComponentProps {
    t1: number
    t2: number
}

function IntervalComponent(
    { index, t1, t2, videoList, setVideoList, videoIndex }: IntervalComponentProps
) {
    const editInterval = () => {
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

    const removeInterval = () => {
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

    return (
        <div className="interval">
            <span>{minAndSec(t1)} ~ {minAndSec(t2)}</span>
            <button className={`edit customButton ${videoList[videoIndex].currentInterval === -2 ? 'enabledButton' : ''}`}
                    onClick={editInterval}>
                <FontAwesomeIcon icon={faPencil} />
            </button>
            <button className={`delete customButton ${videoList[videoIndex].currentInterval === -2 ? 'enabledButton' : ''}`}
                    onClick={removeInterval}>
                <FontAwesomeIcon icon={faX} />
            </button>
        </div>
    )
}

export default function IntervalWrapper(props: MainComponentProps) {
    const intervals = props.videoList[props.videoIndex].intervals.map(
        (currentValue: Interval, index: number) => <IntervalComponent t1={currentValue.from}
                                                                      t2={currentValue.to}
                                                                      index={index}
                                                                      {...props}/>
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
