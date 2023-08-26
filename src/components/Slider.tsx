import '../styles/Slider.scss'
import React, {useEffect, useState} from "react";
import styled from "styled-components";


const logStep = -3
const step = Math.pow(10, logStep)

export function getSliderValue(index: number) {
    return parseFloat(document.getElementsByClassName("range-slider")[0]
        .getElementsByTagName("input")[index].value)
}

function updateIntervalSpan() {
    document.getElementsByClassName("range-slider")[0]
        .getElementsByClassName("rangeValues")[0].innerHTML = `${getSliderValue(0)} - ${getSliderValue(1)}`
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
    if (parseFloat(slides[0].value) > parseFloat(slides[1].value)) {
        slides[index].value = slides[-~-index].value
        setRangeValue(parseFloat(slides[index].value))
    }
    updateIntervalSpan()
    if (playerRef.current) {
        // @ts-ignore
        playerRef.current.seekTo(slides[index].value, 'seconds')
    }
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

export default function Slider(props: { playerRef: React.MutableRefObject<null>, max: number, currentTime: number }) {
    const init1 = Number((props.max * (1 / 5)).toFixed(-logStep))
    const init2 = Number((props.max * (3 / 5)).toFixed(-logStep))
    const maxWidth = 500

    const [rangeValue0, setRangeValue0] = useState(0)
    const [rangeValue1, setRangeValue1] = useState(0)

    const setSliderValue = (index: number, value: number) => {
        document.getElementsByClassName("range-slider")[0].getElementsByTagName("input")[index].value = value.toString();
        (index === 0 ? setRangeValue0 : setRangeValue1)(value)
        updateIntervalSpan()
    }

    useEffect(() => {
        setRangeValue0(init1)
        setRangeValue1(init2)
    }, [init1, init2])

    return (
        <div className="slider">
            <section className="range-slider prevent-select">
                <span className="rangeValues">{init1} - {init2}</span>
                <input className="range1" defaultValue={init1} min={0} max={props.max} step={step} type="range" onChange={(event) => {
                    onChange(props.playerRef, event, rangeValue0, rangeValue1, setRangeValue0, 0)
                }}/>
                <input className="range2" defaultValue={init2} min={0} max={props.max} step={step} type="range" onChange={(event) => {
                    onChange(props.playerRef, event, rangeValue0, rangeValue1, setRangeValue1, 1)
                }}/>
                <SliderFillTrack style={{width: `${maxWidth}px`}} color={'#888888'}/>
                <SliderFillTrack style={{width: `${rangeValue1 / props.max * maxWidth}px`}} color={'#ffc400'}/>
                <SliderFillTrack style={{width: `${rangeValue0 / props.max * maxWidth + 5}px`}} color={'#888888'}/>
            </section>
            <button onClick={() => {
                if (props.currentTime < rangeValue1) {
                    setSliderValue(0, props.currentTime)
                }
            }}>1</button>
            <button onClick={() => {
                if (props.currentTime > rangeValue0) {
                    setSliderValue(1, props.currentTime)
                }
            }}>2</button>
        </div>
    )
}
