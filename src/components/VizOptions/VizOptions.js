import React from "react";
import style from "./VizOption.module.css";
import { useSelector, useDispatch } from "react-redux";
import { loadKeys, hideCol, selectCol, deselectCol, popColData, popCol, popColSel } from "../../reduxStateManager/actions";

function VizOptions() {


    //importo dispatcher
    const dispatch = useDispatch();

    const dispatchKeys = (keysToLoad) => {
        dispatch(loadKeys(keysToLoad));
    }
    const dispatchSelectCol = (colToSelect) => {
        dispatch(selectCol(colToSelect))
    };

    const dispatchDeselectCol = (colToDeselect) => {
        dispatch(deselectCol(colToDeselect))
    };
    const dispatchPopColData = (colToPop) => {
        dispatch(popColData(colToPop));
    }
    const dispatchPopCol = (colToPop) => {
        dispatch(popCol(colToPop));
    }
    const dispatchPopSel = (colToPop) => {
        dispatch(popColSel(colToPop));
    }
    const dispatchHideCol = (colToHideId) => {
        dispatch(hideCol(colToHideId));
    }

    /*recupero lo stato della tabella originale, su cui fare operazioni. Non vado a cambiare questo stato in modo da poterlo usare poi per resettare*/
    const loadedTable = useSelector(state => state.loadedTable);

    /*recupero anche lo stato attuale delle keys*/
    const loadedKeys = useSelector(state => state.loadedKeys);

    // recupero anche le colonne selezionate:
    const selectedCol = useSelector(state => state.selectedCol);

    //setto uno stato locale per l'header da visualizzare
    const [myKeys, setMyKeys] = React.useState(loadedKeys);


    //stato per il controllo dei context menu
    const [contextShow, setContextShow] = React.useState([]);

    //ref per il click destro
    const clickRef = React.useRef();



    /*dallo stato locale poi facciamo derivare quello globale, in questo useffect metto anche la creazione degli input */
    React.useEffect(
        () => {
            dispatchKeys(myKeys);
        }, [myKeys]
    )



    // quando cambio le colonne selezionanate, cambio anche l'header da visualizzare
    React.useEffect(() => {
        setMyKeys(setKeys);
    }, [selectedCol, loadedTable, contextShow])


    function deleteCol(col) {
        // togliere dai dati 
        console.log(col);
        dispatchPopColData(col);
        // togliere dalle colonne 
        dispatchPopCol(col);
        //togliere dalle colonne selezionate 
        dispatchPopSel(col);
    }

    //controllo se devo mostrare un context menu in base alla colonna
    function checkIfContext(col) {
        for (const el of contextShow) {
            if (el.name === col) {
                return true;
            }
        }
        return false;
    }

    // gestisco il click destro sull'header della colonna: nascondo o mostro il context menu
    function displayContextMenu(e, col) {
        e.preventDefault();
        let bounds = clickRef.current.getBoundingClientRect();
        let xPos = e.clientX - bounds.left;
        let yPos = e.clientY - bounds.top;
        if (checkIfContext(col)) {
            const newContextShow = [...contextShow];
            for (let i = 0; i < newContextShow.length; i++) {
                if (newContextShow[i].name === col) {
                    newContextShow.splice(i, 1);
                }
            }
            console.log(contextShow);
            setContextShow(newContextShow);
        } else {
            const newContextShow = [...contextShow];
            const contextToPush = { name: col, xPos: xPos, yPos: yPos };
            newContextShow.push(contextToPush);
            console.log(contextShow);
            setContextShow(newContextShow);
        }
    }

    //funzione per nascondere tutti i context menu
    function hideAllContext() {
        setContextShow([]);
    }

    // trovare le coordinate di un context menu in base alla colonna
    function findContextCoord(col) {
        let xPos = "0px";
        let yPos = "0px";
        for (const el of contextShow) {
            if (el.name === col) {
                xPos = el.xPos;
                yPos = el.yPos;
            }
        }
        return xPos, yPos;
    }



    // questa funzione è chiamata quando cambio le colonne selezionate, per aggiornare l'header
    const setKeys = () => {
        return loadedKeys.map((col) => {
            return {
                Header: <div ref={clickRef}  className={style.headerCell} onContextMenu={(e) => { displayContextMenu(e, col.accessor) }} onClick={(e) => { hideAllContext() }}>
                    {
                        checkIfContext(col.accessor) &&
                        <ul onClick={(e) => { e.stopPropagation() }} style={{ position: "absolute", top: findContextCoord(col.accessor)[0], left: findContextCoord(col.accessor)[1], background: "#fff" }} className={style.contextMenu}>
                            {
                                !checkIfColumnIsSelected(col.id) &&
                                <li>
                                    <div onClick={(e) => { displayContextMenu(e, col.accessor); selectColClick(e, col.id) }} className={style.buttonSelect}>Select</div>
                                </li>
                            }
                            {
                                checkIfColumnIsSelected(col.id) &&
                                <li>
                                    <div onClick={(e) => { displayContextMenu(e, col.accessor); deselectColClick(e, col.id) }} className={style.buttonSelect}>Deselect</div>
                                </li>
                            }

                            <li>
                                <div onClick={()=>{dispatchHideCol(col.id)}} className={style.buttonSelect}>Hide</div>
                            </li>
                            <li>
                                <div onClick={() => { deleteCol(col) }} className={style.buttonSelect}>Delete</div>
                            </li>
                        </ul>
                    }
                    <p>{col.accessor}</p>
                    {
                        checkIfColumnIsSelected(col.id) &&
                        <div className={style.selectedDiv}>
                            Selected
                        </div>
                    }
                    {
                        !checkIfColumnIsSelected(col.id) &&
                        <div className={style.selectedDiv}>

                        </div>
                    }
                </div>,
                accessor: parseInt(col.accessor, 10) || col.accessor,
                show: col.show,
                selected: checkIfColumnIsSelected(col.id),
                id: col.id,
            }
        })
    }


    // controllo se una colonna è selezionata per decidere come visualizzare l'header
    function checkIfColumnIsSelected(col) {
        let isSelected = false;
        for (let el of selectedCol) {
            if (col === el) {
                isSelected = true;
            }
        }
        return isSelected;
    }

    // funzione che si triggera quando clicco sul bottone di selzione di una colonna
    function selectColClick(e, key) {
        e.preventDefault();
        dispatchSelectCol(key);
    }
    // deseleziono la colonna 
    function deselectColClick(e, col) {
        e.preventDefault();
        dispatchDeselectCol(col);
    }


    return (
        <>
            {
                contextShow.length > 0 &&
                <div className={style.hideContext} onClick={(e) => { hideAllContext(); }}>

                </div>
            }
        </>
    )
}



export default VizOptions;