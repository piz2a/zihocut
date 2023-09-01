import React, {JSX, ReactNode, useEffect} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faX} from "@fortawesome/free-solid-svg-icons";

interface EnterButtonProps {
    onClick?: Function,
    children?: ReactNode;
}

export function EnterButton({ onClick = () => {}, children = <></> }: EnterButtonProps) {
    return <button onClick={() => onClick()} className="enterButton customButton">
        {children}
    </button>
}

export function setDialog(
    setIsPopup: React.Dispatch<React.SetStateAction<boolean>>,
    setCurrentDialog: React.Dispatch<React.SetStateAction<JSX.Element>>,
    dialogBody: ReactNode
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
                <div className="dialogWrapper">
                    <button onClick={() => setIsPopup(false)} className="closeButton customButton">
                        <FontAwesomeIcon icon={faX} />
                    </button>
                    {dialogBody}
                </div>
            </dialog>
        )
    }
    setIsPopup(true)
    setCurrentDialog(<DialogElement/>)
}