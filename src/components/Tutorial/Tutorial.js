import style from "./Tutorial.module.css";
import arrow from "./../../assets/icons/arrow.png";
import { Transition } from "react-transition-group";
import React from "react";

/*Transitions styles.. */
const duration = 1000;
const defaultStyle = {
    transition: `left opacity ${duration}ms ease-in-out`,
    opacity: 0,
    left: "-500px",
}

const transitionStyle = {
    entering: { opacity: 1, left: "0" },
    entered: { opacity: 1, left: "0" },
}

const defaultStyle1 = {
    transition: ` top ${duration} opacity ${duration}ms ease-in-out`,
    opacity: 0,
    top: "-500px",
}

const transitionStyle1 = {
    entering: { opacity: 1, top: "0" },
    entered: { opacity: 1, top: "0" },
}

const defaultStyle2 = {
    transition: ` left ${duration} opacity ${duration}ms ease-in-out`,
    opacity: 0,
    left: "500px",
}

const transitionStyle2 = {
    entering: { opacity: 1, left: "0" },
    entered: { opacity: 1, left: "0" },
}

function Tutorial() {

    
    /*These are the transition state */
    const [inProp, setInProp] = React.useState(false);
    const [inProp1, setInProp1] = React.useState(false);
    const [inProp2, setInProp2] = React.useState(false);


    /*This useEffect handle the transitions */
    React.useEffect(() => {
        setInProp(true);
        const timer1 = setTimeout(() => {
            setInProp1(true);
        }, 200);

        const timer2 = setTimeout(() => {
            setInProp2(true);
        }, 200);

        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
        }
    },[])

    return (
        <>
            <div className={style.tutorialDiv}>
                <Transition in={inProp} timeout={duration}>
                    {state => (
                        <div style={{
                            ...defaultStyle,
                            ...transitionStyle[state]
                        }}
                            className={style.tutorialStep}>
                            <h3 className={style.stepTitle}>Get Your Data</h3>
                            <p>My Table Project allow to load your data in different ways (choose one):</p>
                            <ul>
                                <li className={style.getModeTut}><b>Get your data from our server:</b><br />
                        In our server you can get Covid pandemic data and meteo data</li>
                                <li className={style.getModeTut}><b>Get your data from your favorite API:</b><br />
                        You can also get your data from an external API</li>
                                <li className={style.getModeTut}><b>Get your data from your file system:</b><br />
                        Load your data from your local file system</li>
                            </ul>
                            <div className={style.scrollDownContainer}>
                                <img src={arrow} alt="arrow"/>
                            </div>

                        </div>)}
                </Transition>

                <Transition in={inProp1} timeout={duration}>
                    {state => (
                        <div style={{
                            ...defaultStyle1,
                            ...transitionStyle1[state]
                        }}
                            className={style.tutorialStep}>
                            <h3 className={style.stepTitle}>Manage Your Table</h3>
                            <p>In My Table Project you can view you table ad do some operation on it, for example filter column and row and merging data from two different dataset.
                        </p>
                            <p><b>Load now your first dataset and try!</b></p>
                        </div>
                    )}
                </Transition>

                <Transition in={inProp2} timeout={duration}>
                    {state => (
                        <div style = {{
                            ...defaultStyle2,
                            ...transitionStyle2[state]
                        }}
                        className={style.tutorialStep}>
                            <h3 className={style.stepTitle}>Save Your Data</h3>
                            <p>In My Table Project you can easly save your work on our server and get them later</p>
                            <p><b>Load now your first dataset and try!</b></p>
                        </div>
                    )}
                </Transition>


            </div>

        </>

    )
}

export default Tutorial;