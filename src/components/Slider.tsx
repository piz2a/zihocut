import '../styles/Slider.scss'
import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {setVideoProps, Video} from "../Interfaces";
import {NEW_INTERVAL, NO_INTERVAL_SELECTED} from "./Editor";
import {minAndSec} from "./IntervalWrapper";


export const logStep = -2
const step = Math.pow(10, logStep)
const defaultSliderColor = '#888888'
const intervalSliderColor = '#ffc400'

export function getSliderValue(index: number) {
    return parseFloat(document.getElementsByClassName("range-slider")[0]
        .getElementsByTagName("input")[index].value)
}

function updateIntervalSpan() {
    document.getElementsByClassName("range-slider")[0]
        .getElementsByClassName("rangeValues")[0].innerHTML
        = `${minAndSec(getSliderValue(0))} - ${minAndSec(getSliderValue(1))}`
}

function onChange(
    playerRef: React.MutableRefObject<null>,
    event: React.ChangeEvent<HTMLInputElement>,
    rangeValue1: number,
    rangeValue2: number,
    setRangeValue: React.Dispatch<React.SetStateAction<number>>,
    index: number
) {
    setRangeValue(parseFloat(event.target.value))
    const parent = document.getElementsByClassName("range-slider")[0]
    const slides = parent.getElementsByTagName("input");
    if (parseFloat(slides[0].value) >= parseFloat(slides[1].value)) {
        slides[index].value = (parseFloat(slides[-~-index].value) + (2 * index - 1) * step).toString()
        setRangeValue(parseFloat(slides[index].value))
    }
    updateIntervalSpan()
    if (playerRef.current) {
        // @ts-ignore
        playerRef.current.seekTo(slides[index].value, 'seconds')
    }
}

/*
function testInterval(from: number, to: number) {
    // Coming soon
}
 */

function saveInterval(
    intervalIndex: number,
    videoIndex: number,
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>,
    from: number,
    to: number
) {
    if (intervalIndex === NEW_INTERVAL) intervalIndex = videoList[videoIndex].intervals.length
    setVideoProps(
        "intervals",
        videoIndex,
        [
            ...videoList[videoIndex].intervals.slice(0, intervalIndex),
            { from: from.toString(), to: to.toString() },
            ...videoList[videoIndex].intervals.slice(intervalIndex + 1)
        ],
        videoList,
        setVideoList
    )
    setVideoProps('currentInterval', videoIndex, NO_INTERVAL_SELECTED, videoList, setVideoList)
}

function cancelEdit(
    videoIndex: number,
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>,
) {
    setVideoProps('currentInterval', videoIndex, NO_INTERVAL_SELECTED, videoList, setVideoList)
}

const SliderFillTrack = styled.div.attrs((props) => ({
    style: {
        width: props.style !== undefined ? props.style.width : 0
    }
}))<{ color: string }>`
  height: 0.8rem;
  background-color: ${props => props.color};
  position: absolute;
  border-radius: 0.4rem;
  top: 1.9em;
  z-index: 11;
`;

export default function Slider(props: {
    playerRef: React.MutableRefObject<null>,
    max: number,
    currentTime: number,
    playing: boolean,
    setPlaying: React.Dispatch<React.SetStateAction<boolean>>
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>,
    videoIndex: number,
    setVideoIndex: React.Dispatch<React.SetStateAction<number>>
}) {
    const maxWidth = 760

    const [init1, init2] = props.videoList[props.videoIndex].currentInterval === -1 ?
        [Number((props.max * (1 / 5)).toFixed(-logStep)), Number((props.max * (3 / 5)).toFixed(-logStep))] :
        [props.videoList[props.videoIndex].intervals[props.videoList[props.videoIndex].currentInterval]]
            .map((interval) => [interval.from, interval.to])[0]

    const [rangeValue0, setRangeValue0] = useState(0)
    const [rangeValue1, setRangeValue1] = useState(0)

    const setSliderValue = (index: number, value: number) => {
        document.getElementsByClassName("range-slider")[0].getElementsByTagName("input")[index].value = value.toString();
        (index === 0 ? setRangeValue0 : setRangeValue1)(value)
        updateIntervalSpan()
    }

    useEffect(() => {
        updateIntervalSpan()
        setRangeValue0(init1)
        setRangeValue1(init2)
    }, [init1, init2])

    return (
        <>
            <div className="slider">
                <section className="range-slider prevent-select">
                    <span className="rangeValues"></span>
                    <input className="range1" defaultValue={init1} min={0} max={props.max} step={step} type="range"
                           onChange={(event) => {
                               onChange(props.playerRef, event, rangeValue0, rangeValue1, setRangeValue0, 0)
                           }}/>
                    <input className="range2" defaultValue={init2} min={0} max={props.max} step={step} type="range"
                           onChange={(event) => {
                               onChange(props.playerRef, event, rangeValue0, rangeValue1, setRangeValue1, 1)
                           }}/>
                    <SliderFillTrack style={{width: `${maxWidth}px`}} color={defaultSliderColor}/>
                    <SliderFillTrack style={{width: `${rangeValue1 / props.max * maxWidth}px`}} color={intervalSliderColor}/>
                    <SliderFillTrack style={{width: `${rangeValue0 / props.max * maxWidth}px`}} color={defaultSliderColor}/>
                </section>
            </div>
            <div className="sliderButtonWrapper">
                <button onClick={() => {
                    if (props.currentTime < rangeValue1) {
                        setSliderValue(0, props.currentTime)
                    }
                }} className="customButton setSliderTimeButton">
                    Move
                    <span className="sliderIcon red"></span>
                    to current time
                </button>
                <button onClick={() => {
                    if (props.currentTime > rangeValue0) {
                        setSliderValue(1, props.currentTime)
                    }
                }} className="customButton setSliderTimeButton">
                    Move
                    <span className="sliderIcon blue"></span>
                    to current time
                </button>
                {/*<button onClick={() => testInterval(getSliderValue(0), getSliderValue(1))}>Play Interval</button>*/}
                <button onClick={() => saveInterval(
                    props.videoList[props.videoIndex].currentInterval,
                    props.videoIndex,
                    props.videoList,
                    props.setVideoList,
                    getSliderValue(0),
                    getSliderValue(1)
                )} className="customButton saveIntervalButton">
                    {props.videoList[props.videoIndex].currentInterval === NEW_INTERVAL ?
                        "Add interval" :
                        `Save interval #${props.videoList[props.videoIndex].currentInterval + 1}`
                    }
                </button>
                <button onClick={() => cancelEdit(props.videoIndex, props.videoList, props.setVideoList)}
                        className="customButton cancelEditButton">Cancel</button>
            </div>
        </>
    )
}
