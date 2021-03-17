import React from "react";
import style from "./VizOption.module.css";
import { useSelector, useDispatch } from "react-redux";
import { loadKeys, hideCol, showCol, selectCol, deselectCol } from "../../reduxStateManager/actions";

function VizOptions() {


    //importo dispatcher
    const dispatch = useDispatch();

    const dispatchKeys = (keysToLoad) => {
        dispatch(loadKeys(keysToLoad));
    }
    const dispatchHideCol = (colToShowId) => {
        dispatch(hideCol(colToShowId));
    }
    const dispatchShowCol = (colToShowId) => {
        dispatch(showCol(colToShowId));
    }
    const dispatchSelectCol = (colToSelect) => {
        dispatch(selectCol(colToSelect))
    };

    const dispatchDeselectCol = (colToDeselect) => {
        dispatch(deselectCol(colToDeselect))
    };

    /*recupero lo stato della tabella originale, su cui fare operazioni. Non vado a cambiare questo stato in modo da poterlo usare poi per resettare*/
    const loadedTable = useSelector(state => state.loadedTable);

    /*recupero anche lo stato attuale delle keys*/
    const loadedKeys = useSelector(state => state.loadedKeys);

    // recupero anche le colonne selezionate:
    const selectedCol = useSelector(state => state.selectedCol);

    //setto uno stato locale per l'header da visualizzare
    const [myKeys, setMyKeys] = React.useState(loadedKeys);

    //uno stato per la visdualizzazione del pannello Hide/show

    const [showPanel, setShowPanel] = React.useState(false);

    // const per le checkbox Show/hide
    const checkBoxes = loadedKeys.map((key) => {
        return (
            <div className={style.halfBox} key={key.accessor}>
            <label>{key.accessor}</label>
            <input type="checkbox" value={key.id} defaultChecked onChange={(e) => {handleCheckBoxchange(e, key.accessor)}}/>
            </div>
        )
    })

    // un array di elementi per le colonne selzionate
    const selectedColToViz = selectedCol.map((col => {
        return(
            <li key ={col}>
                {col}
            </li>
        )
    }))

    /*dallo stato locale poi facciamo derivare quello globale, in questo useffect metto anche la creazione degli input */
    React.useEffect(
        () => {
            dispatchKeys(myKeys);
        }, [myKeys]
    )

    // quando cambio le colonne selezionanate, cambio anche l'header da visualizzare
    React.useEffect(() => {
        setMyKeys(setKeys);
    }, [selectedCol])



    // questa funzione è chiamata quando cambio le colonne selezionate, per aggiornare l'header
    const setKeys = () => {
        return Object.keys(loadedTable[0]).map((key) => {
            return {
                Header: <><p>{key}</p> {
                    !checkIfColumnIsSelected(key) &&
                    <button className={style.buttonSelect} onClick={e => { selectColClick(e, key) }}>Select</button>
                }
                    {
                        checkIfColumnIsSelected(key) &&
                        <button className={style.buttonSelect} onClick={e => { deselectColClick(e, key) }}> Deselect </button>
                    } </>,
                accessor: parseInt(key, 10) || key,
                show: true,
                id: key,
            }
        })
    }

    // funzione che si triggera all'onchange delle checkboxes
    function handleCheckBoxchange(event, key) {
        if (event.target.checked) {
            dispatchShowCol(event.target.value);
        } else {
            dispatchHideCol(event.target.value);
        }
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
        <div className={style.toVisualDiv}>
            <div className={style.halfBox}>
                    <h3>Selected Columns:</h3>
                    {selectedColToViz}
            </div>
            <div className={style.halfBox}>
                <h3>Options</h3>
                <button onClick = {() => {setShowPanel(!showPanel)}}>Show/Hide Columns</button>
                {showPanel &&
                    <div>
                        {checkBoxes}
                    </div>
                }

            </div>
        </div>

    )
}



export default VizOptions;