import React, {useEffect, useState} from 'react'
// import * as path from 'path'
// import {PythonShell} from "python-shell"
import './App.scss'
import {IntervalWrapper, Interval} from "./components/IntervalWrapper"
import {VideoCardWrapper} from "./components/VideoCardWrapper";
import {Editor} from "./components/Editor";

/*
const path = window.require('path')
const url = window.require('url')
const PythonShell = window.require('python-shell')
const electron = window.require('electron');
const {dialog} = electron.remote;
/*

const PUBLIC_PATH = path.join(__dirname, process.env.PUBLIC_URL)
const PYTHON_PATH = path.join(PUBLIC_PATH, 'venv/Scripts/python')
 */


function App() {
    const [videoURL, setVideoURL] = useState(process.env.PUBLIC_URL + 'maze.mp4')
    const [intervalList, setIntervalList] = useState<Interval[]>([])

    function handleDrop(event: any) {
        event.preventDefault()
        const text = event.dataTransfer.getData('text')
        console.log(text)
        setVideoURL(text)
        /*
        const video_id = url.parse(text, true)
        console.log(video_id)

        PythonShell.run('download.py', {
            mode: 'text',
            pythonPath: PYTHON_PATH,
            pythonOptions: ['-u'], // get print results in real-time
            scriptPath: PUBLIC_PATH,
            args: ['value1', 'value2', 'value3'],
        }).then((messages: string[]) => {
            for (let message in messages) {
                console.log(message)
            }
        })
         */
    }

    function handleDragOver(event: any) {
        event.preventDefault()
        console.log(videoURL)
    }

    function handleClick() {
        const URL = prompt("Paste a YouTube video URL here:")
        if (URL != null) setVideoURL(URL)
    }

    useEffect(() => {
        document.body.addEventListener("dragover", handleDragOver)
        document.body.addEventListener("drop", handleDrop)
    }, [])

    return (
        <div className="App">
            <div className="header prevent-select">
                <button onClick={handleClick} className="addCard customButton">
                    <h2>+</h2>
                    <p>Paste URL</p>
                </button>
                <VideoCardWrapper/>
            </div>
            <hr/>
            <div className="main">
                <Editor videoURL={videoURL} intervalList={intervalList} setIntervalList={setIntervalList}/>
                <div className="vr"></div>
                <IntervalWrapper intervalList={intervalList} setIntervalList={setIntervalList}/>
            </div>
        </div>
    )
}

export default App
