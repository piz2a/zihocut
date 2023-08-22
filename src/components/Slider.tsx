import {useEffect} from "react";
import '../styles/Slider.scss'

function getValues(parent: Element){
    // Get slider values
    const slides = parent.getElementsByTagName("input");
    let slide1 = parseFloat( slides[0].value );
    let slide2 = parseFloat( slides[1].value );
    // Neither slider will clip the other, so make sure we determine which is larger
    if( slide1 > slide2 ){
        const tmp = slide2;
        slide2 = slide1;
        slide1 = tmp;
    }
    const displayElement = parent.getElementsByClassName("rangeValues")[0];
    displayElement.innerHTML = slide1 + " - " + slide2;
}

export default function Slider() {
    useEffect(() => {
        // Initialize Sliders
        const sliderSections = document.getElementsByClassName("range-slider");
        for (let x = 0; x < sliderSections.length; x++){
            const sliders = sliderSections[x].getElementsByTagName("input");
            for (let y = 0; y < sliders.length; y++){
                if( sliders[y].type === "range"){
                    sliders[y].onchange = () => getValues(sliderSections[x]);
                    // Manually trigger event first time to display values
                    // @ts-ignore
                    sliders[y].onchange();
                }
            }
        }
    }, [])

    return (
        <section className="range-slider">
            <span className="rangeValues"></span>
            <input value="5" min="0" max="15" step="0.5" type="range"/>
            <input value="10" min="0" max="15" step="0.5" type="range"/>
        </section>
    )
}