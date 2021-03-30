import React from "react";

function ContextMenu(props) {
    console.log(props);

    const { contextShow, yPos, xPos } = props;

    return (
        <div style={{
            position: "absolute",
            top: "0px",
            left: "0px",
            background: "#fff", 
        }
        }>
            <li>
                Ciao
            </li>
            <li>
                Ciao
            </li>
        </div>
    )
}

export default ContextMenu;