import style from "./GetData.module.css";
import GetAPI from "../GetAPI/GetAPI"
import GetLocal from "../GetLocal/GetLocal";
import { Transition } from "react-transition-group";
import React from "react";
import {Link} from "react-router-dom";

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
    const [inProp, setInProp] = React.useState(false);
    const [inProp2, setInProp2] = React.useState(false);


    React.useEffect(() => {
        const timer = setTimeout(() => {
            setInProp(true);
        }, 400);

        const timer2 = setTimeout(() => {
            setInProp2(true);
        }, 400);

        return () => {
            clearTimeout(timer);
            clearTimeout(timer2);
        }
    })

    return (
        <div>
            <div className={style.getContainer}>
                <Transition in={inProp} timeout={duration}>
                    {state =>
                        <div style={{
                            ...defaultStyle,
                            ...transitionStyle[state]
                        }}
                            className={style.getModeDiv}>
                            <GetAPI>

                            </GetAPI>
                        </div>
                    }
                </Transition>
                <Transition in={inProp2} timeout={duration}>
                    {state =>
                        <div style={{
                            ...defaultStyle2,
                            ...transitionStyle2[state]
                        }}
                            className={style.getModeDiv}>
                            <GetLocal>

                            </GetLocal>
                        </div>

                    }

                </Transition>
            </div>
            <Link to="/view-table">
                <div className={style.viewTableCTA}>View your Table >></div>
            </Link>
            
        </div>
    )
}

export default Tutorial;