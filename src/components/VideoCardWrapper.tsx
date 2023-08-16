import React from "react"

function VideoCard() {
    return (
        <div className="card">
            <h2>Card1</h2>
        </div>
    )
}

function VideoCardWrapper() {
    return (
        <div className="horizontal-scrolling-wrapper">
            <VideoCard/>
            <VideoCard/>
            <VideoCard/>
            <VideoCard/>
        </div>
    )
}

export {VideoCardWrapper}