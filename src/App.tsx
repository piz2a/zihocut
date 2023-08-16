import React, {useEffect, useState} from 'react'
import ReactPlayer from "react-player";
// import * as path from 'path'
// import {PythonShell} from "python-shell"
import logo from './logo.svg'
import './App.scss'

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

function VideoCard() {
    return (
        <div className="card">

        </div>
    )
}

function Interval(t1: string, t2: string) {
    return (
        <div className="interval">
            <input type="text" className="t1" value={t1}/>
            <span>to</span>
            <input type="text" className="t2" value={t2}/>
        </div>
    )
}


function App() {
    const [videoURL, setVideoURL] = useState(process.env.PUBLIC_URL + 'antifragile.mp4')

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
                <div className="horizontal-scrolling-wrapper">
                    <div className="card"><h2>Card1</h2></div>
                    <div className="card"><h2>Card2</h2></div>
                    <div className="card"><h2>Card3</h2></div>
                    <div className="card"><h2>Card4</h2></div>
                    <div className="card"><h2>Card5</h2></div>
                    <div className="card"><h2>Card6</h2></div>
                    <div className="card"><h2>Card7</h2></div>
                    <div className="card"><h2>Card8</h2></div>
                    <div className="card"><h2>Card9</h2></div>
                </div>
            </div>
            <hr/>
            <div className="main">
                <div className="selector">
                    <ReactPlayer url={videoURL} width="540px" height="300px" muted={true} controls={true} />
                </div>
                <div className="vr"></div>
                <div className="interval-wrapper">
                    {Interval("0:00", "0:10")}
                    {Interval("0:20", "0:30")}
                </div>
            </div>
        </div>
    )
}

export default App
