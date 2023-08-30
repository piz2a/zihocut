import React from "react"

export interface Interval {
    from: number
    to: number
}

export interface Video {
    id: string
    status: number
    intervals: Interval[]
    currentInterval: number
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

export const videoStatus = {
    DOWNLOADING: 0,
    DOWNLOAD_COMPLETE: 1,
    DOWNLOAD_FAILED: 2,
    EXPORTING: 3,
    EXPORT_COMPLETE: 4
}