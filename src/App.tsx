import React, {useEffect, useState} from 'react'
import './styles/App.scss'
import {setVideoProps, Video, videoStatus} from "./Interfaces"
import VideoCardWrapper from "./components/VideoCardWrapper"
import Editor, {NEW_INTERVAL} from "./components/Editor"
import {EnterButton, setDialog} from "./components/Dialog";

export function updateVideoIndex(
    videoList: Video[],
    setVideoList: React.Dispatch<React.SetStateAction<Video[]>>,
    videoIndex: number,
    setVideoIndex: React.Dispatch<React.SetStateAction<number>>
) {
    let editableVideoExist = false
    for (let i = 0; i < videoList.length; i++) {
        if (videoList[i].status === videoStatus.DOWNLOAD_COMPLETE) {
            setVideoIndex(i)
            editableVideoExist = true
            break
        }
    }
    if (!editableVideoExist) setVideoIndex(-1)
}


export default function App() {
    const [videoList, setVideoList] = useState<Video[]>([])
    const [videoIndex, setVideoIndex] = useState(-1)
    const [isPopup, setIsPopup] = useState(false)
    const [currentDialog, setCurrentDialog] = useState(<></>)
    const { ipcRenderer } = window.require('electron')

    const addVideo = async (URL: string) => {
        const id = await ipcRenderer.invoke('GET_ID_FROM_URL', URL)
        if (id === null) {
            setDialog(setIsPopup, setCurrentDialog, (
                <>
                    <label>Invalid URL: Try again.</label>
                    <EnterButton onClick={() => setIsPopup(false)}>OK</EnterButton>
                </>
            ))
            return
        }
        await ipcRenderer.invoke('QUEUE_VIDEO', id)
        console.log(videoList)
        setVideoList([...videoList, {id: id, title: `ID: ${id}`, status: videoStatus.DOWNLOADING, intervals: [], currentInterval: NEW_INTERVAL}])
    }

    const handleDragOver = (event: any) => {
        event.preventDefault()
    }

    const handleClick = async () => {
        setDialog(setIsPopup, setCurrentDialog, (
            <>
                <label>Paste a YouTube video URL here:</label>
                <input name="URL" id="urlPrompt" type="url"/>
                <EnterButton onClick={() => {
                    // @ts-ignore
                    addVideo(document.getElementById('urlPrompt').value)
                    setIsPopup(false)
                }}>Download</EnterButton>
            </>
        ))
    }

    useEffect(() => {
        const handleDrop = async (event: any) => {
            event.preventDefault()
            const text = event.dataTransfer.getData('text')
            console.log(text)
            await addVideo(text)
        }
        document.body.addEventListener('dragover', handleDragOver)
        document.body.addEventListener('drop', handleDrop)
        ipcRenderer.on('VIDEO_TITLE', (event: any, message: { id: string, title: string }) => {
            videoList.forEach((video, index) => {
                if (message.id === video.id)
                    setVideoProps("title", index, message.title, videoList, setVideoList)
            })
        })
        ipcRenderer.on('DOWNLOAD_COMPLETE', (event: any, message: { id: string, code: string }) => {
            // console.log(videoList.length)
            videoList.forEach((video, index) => {
                console.log(index)
                if (message.id === video.id && video.status === videoStatus.DOWNLOADING)
                    setVideoProps("status", index, videoStatus.DOWNLOAD_COMPLETE, videoList, setVideoList)
            })
            if (videoIndex === -1) {
                updateVideoIndex(videoList, setVideoList, videoIndex, setVideoIndex)
            }
        })
        ipcRenderer.on('DOWNLOAD_FAILED', (event: any, message: { id: string, code: number }) => {
            setDialog(setIsPopup, setCurrentDialog, (
                <>
                    <label>Download failed: {message.id}<br/>Exit code: {message.code}</label>
                    <EnterButton onClick={() => setIsPopup(false)}>OK</EnterButton>
                </>
            ))
            videoList.forEach((video, index) => {
                if (message.id === video.id)
                    setVideoProps("status", index, videoStatus.DOWNLOAD_FAILED, videoList, setVideoList)
            })
        })
        ipcRenderer.on('EXPORT_COMPLETE', (event: any, message: { id: string }) => {
            videoList.forEach((video, index) => {
                if (message.id === video.id) {
                    setVideoProps(
                        'status',
                        index,
                        videoStatus.EXPORT_COMPLETE,
                        videoList,
                        setVideoList
                    )
                    updateVideoIndex(videoList, setVideoList, videoIndex, setVideoIndex)
                }
            })
        })
        ipcRenderer.on('EXPORT_FAILED', (event: any, message: { id: string }) => {
            videoList.forEach((video, index) => {
                if (message.id === video.id) {
                    setDialog(setIsPopup, setCurrentDialog, (
                        <>
                            <label>Export failed: {message.id}</label>
                        </>
                    ))
                    setVideoProps(
                        'status',
                        index,
                        videoStatus.DOWNLOAD_COMPLETE,
                        videoList,
                        setVideoList
                    )
                }
            })
        })
    }, [videoList, videoIndex, ipcRenderer])

    return (
        <div className="App">
            { isPopup ? <><div className="fadeMe"></div>{currentDialog}</> : <></> }
            <div className="header prevent-select">
                <button onClick={handleClick} className="addCard customButton">
                    <h2>+</h2>
                    <p>Paste URL</p>
                </button>
                <VideoCardWrapper videoList={videoList}
                                  setVideoList={setVideoList}
                                  videoIndex={videoIndex}
                                  setVideoIndex={setVideoIndex}
                                  setIsPopup={setIsPopup}
                                  setCurrentDialog={setCurrentDialog}/>
            </div>
            <hr/>
            {videoList.length !== 0 && videoIndex !== -1 ?
                <Editor videoList={videoList}
                        setVideoList={setVideoList}
                        videoIndex={videoIndex}
                        setVideoIndex={setVideoIndex}
                        setIsPopup={setIsPopup}
                        setCurrentDialog={setCurrentDialog}/> :
                <div className="main">
                    <h2 className="emptyVideoList prevent-select">
                        Drag-and-drop YouTube links here<br/>to download and cut videos
                    </h2>
                </div>
            }
        </div>
    )
}
