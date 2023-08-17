import React, {useEffect, useState} from 'react'
import './App.scss'
import {IntervalWrapper, Interval} from "./components/IntervalWrapper"
import {VideoCardWrapper, Video} from "./components/VideoCardWrapper"
import {Editor} from "./components/Editor"


function App() {
    const [videoList, setVideoList] = useState<Video[]>([{id: process.env.PUBLIC_URL + 'maze.mp4', downloadComplete: true}])
    const [intervalList, setIntervalList] = useState<Interval[]>([])
    const [isPopup, setIsPopup] = useState(false);
    const [currentDialog, setCurrentDialog] = useState(<></>)

    const addVideo = (URL: string) => {
        setVideoList([...videoList, {id: URL, downloadComplete: false}])
    }

    const handleDrop = (event: any) => {
        event.preventDefault()
        const text = event.dataTransfer.getData('text')
        console.log(text)
        addVideo(text)
    }

    const handleDragOver = (event: any) => {
        event.preventDefault()
    }

    const handleClick = async () => {
        setIsPopup(true)
        setCurrentDialog(
            <dialog open>
                <button onClick={() => setIsPopup(false)} className="closeButton">X</button>
                <label>Paste a YouTube video URL here:</label>
                <input name="URL" id="urlPrompt" type="url"/>
                <button onClick={() => {
                    // @ts-ignore
                    addVideo(document.getElementById('urlPrompt').value)
                    setIsPopup(false)
                }} className="downloadButton">Download</button>
            </dialog>
        )
    }

    useEffect(() => {
        document.body.addEventListener('dragover', handleDragOver)
        document.body.addEventListener('drop', handleDrop)
    }, [])

    return (
        <div className="App">
            {isPopup ? <div className="fadeMe"></div> : <></>}
            {isPopup ? currentDialog : <></>}
            <div className="header prevent-select">
                <button onClick={handleClick} className="addCard customButton">
                    <h2>+</h2>
                    <p>Paste URL</p>
                </button>
                <VideoCardWrapper videoList={videoList} setVideoList={setVideoList}/>
            </div>
            <hr/>
            {videoList.length !== 0 ?
                <div className="main">
                    <Editor videoList={videoList}
                            setVideoList={setVideoList}
                            intervalList={intervalList}
                            setIntervalList={setIntervalList}/>
                    <div className="vr"></div>
                    <IntervalWrapper intervalList={intervalList} setIntervalList={setIntervalList}/>
                </div> :
                <div className="main">
                    <h2 className="emptyVideoList">
                        Drag-and-drop YouTube links here<br/>to start downloading and cropping videos
                    </h2>
                </div>
            }
        </div>
    )
}

export default App
