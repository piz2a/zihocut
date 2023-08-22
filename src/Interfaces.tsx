import React from "react"

export interface Interval {
    from: string
    to: string
}

export interface Video {
    id: string
    downloadComplete: boolean
    intervals: Interval[]
}

export function setVideo(
    index: number,
    value: Video,
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>
) {
    setVideoList([...videoList.slice(0, index), value, ...videoList.slice(index + 1)])
}

export function setVideoProps(
    propName: string,
    videoIndex: number,
    value: any,
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>,
) {
    const video = videoList[videoIndex]
    // @ts-ignore
    video[propName] = value
    setVideo(videoIndex, video, videoList, setVideoList)
}