import React, {JSX, useEffect, useState} from 'react'
import './styles/App.scss'
import {Video, videoStatus} from "./Interfaces"
import VideoCardWrapper from "./components/VideoCardWrapper"
import Editor, {NEW_INTERVAL} from "./components/Editor"

export function setDialog(
    setIsPopup: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentDialog: React.Dispatch<React.SetStateAction<JSX.Element>>,
    dialogBody: JSX.Element
) {
    const DialogElement = () => {
        useEffect(() => {
            const input = document.getElementById("urlPrompt")
            if (input === null) return
            input.addEventListener("keypress", (event) => {
                if (event.key === "Enter") {
                    event.preventDefault()
                    const downloadButton = document.getElementById("enterButton")
                    // @ts-ignore
                    if (downloadButton !== null && input.value !== "") downloadButton.click()
                }
            })
            input.focus()
        }, [])
        return (
            <dialog open>
                <button onClick={() => setIsPopup(false)} id="closeButton">X</button>
                {dialogBody}
            </dialog>
        )
    }
    setIsPopup(true)
    setCurrentDialog(<DialogElement/>)
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
                <dialog open>
                    <button onClick={() => setIsPopup(false)} id="closeButton">X</button>
                    <label>Invalid URL: Try again.</label>
                    <button onClick={() => setIsPopup(false)} id="enterButton">OK</button>
                </dialog>
            ))
            return
        }
        await ipcRenderer.invoke('QUEUE_VIDEO', id)
        console.log(videoList)
        setVideoList([...videoList, {id: id, status: videoStatus.DOWNLOADING, intervals: [], currentInterval: NEW_INTERVAL}])
    }

    const handleDrop = async (event: any) => {
        event.preventDefault()
        const text = event.dataTransfer.getData('text')
        console.log(text)
        await addVideo(text)
    }

    const handleDragOver = (event: any) => {
        event.preventDefault()
    }

    const handleClick = async () => {
        setDialog(setIsPopup, setCurrentDialog, (
            <dialog open>
                <button onClick={() => setIsPopup(false)} id="closeButton">X</button>
                <label>Paste a YouTube video URL here:</label>
                <input name="URL" id="urlPrompt" type="url"/>
                <button onClick={() => {
                    // @ts-ignore
                    addVideo(document.getElementById('urlPrompt').value)
                    setIsPopup(false)
                }} id="enterButton">Download</button>
            </dialog>
        ))
    }

    useEffect(() => {
        document.body.addEventListener('dragover', handleDragOver)
        document.body.addEventListener('drop', handleDrop)
    }, [])

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
