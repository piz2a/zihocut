import React from "react"

interface Interval {
    from: string
    to: string
}

function removeInterval(
    index: number,
    intervalList: Interval[],
    setIntervalList: React.Dispatch<React.SetStateAction<Interval[]>>
) {
    setIntervalList([...intervalList.slice(0, index), ...intervalList.slice(index + 1)])
}

function IntervalComponent(
    index: number, t1: string, t2: string,
    intervalList: Interval[],
    setIntervalList: React.Dispatch<React.SetStateAction<Interval[]>>
) {
    return (
        <div className="interval">
            <input type="text" className="t1" value={t1}/>
            <span>~</span>
            <input type="text" className="t2" value={t2}/>
            <button className="delete customButton"
                    onClick={() => removeInterval(index, intervalList, setIntervalList)}>
                X
            </button>
        </div>
    )
}

function IntervalWrapper(props: {
    intervalList: Interval[],
    setIntervalList: React.Dispatch<React.SetStateAction<Interval[]>>
}) {
    const intervals = props.intervalList.map(
        (currentValue: Interval, index: number) => IntervalComponent(
            index, currentValue.from, currentValue.to, props.intervalList, props.setIntervalList
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