import React from "react";
import { hideCol, showCol } from "../../reduxStateManager/actions";
import { useSelector, useDispatch } from "react-redux";
import style from "./ShowHide.module.css";

function ShowHide() {

    //dispatcher per nascondere e mostrare le colonne

    const dispatch = useDispatch()
    const dispatchHideCol = (colToHideId) => {
        dispatch(hideCol(colToHideId));
    }
    const dispatchShowCol = (colToShowId) => {
        dispatch(showCol(colToShowId));
    }

    /*recupero anche lo stato attuale delle keys*/
    const loadedKeys = useSelector(state => state.loadedKeys);


    //uno stato per la visdualizzazione del pannello Hide/show
    const [showPanel, setShowPanel] = React.useState(false);

    // const per le checkbox Show/hide
    const checkBoxes = loadedKeys.map((key) => {
        return (
            <div className={style.checkContainer} key={key.accessor}>

                    <label>{key.accessor} </label>
                    <label className={"customCheckbox"}>
                        <input hidden type="checkbox" value={key.id} checked={key.show} onChange={(e) => { handleCheckBoxchange(e, key.accessor) }}/>
                        <span></span>
                    </label>
            </div>
        )
    })

    // funzione che si triggera all'onchange delle checkboxes
    function handleCheckBoxchange(event, key) {
        if (event.target.checked) {
            dispatchShowCol(event.target.value);
        } else {
            dispatchHideCol(event.target.value);
        }
    }

    //blocco scroll se l'overlay è aperto
    React.useEffect(() => {
        if (showPanel) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "scroll";
        }
    }, [showPanel])


    return (
        <>

            <button onClick={(e) => { setShowPanel(!showPanel) }}>Show/Hide Columns</button>
            { showPanel &&
                <div className={"overlay"} onClick={(e) => { setShowPanel(false) }}>
                    <div className={"panel"} onClick={(e) => { e.stopPropagation() }}>
                        <h3>
                            Hide/Show columns:
                        </h3>
                        {checkBoxes}
                    </div>
                </div>
            }
        </>
    )
}

export default ShowHide;