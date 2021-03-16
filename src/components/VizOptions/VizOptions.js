import React from "react";
import style from "./VizOption.module.css";
import { useSelector, useDispatch } from "react-redux";
import { loadKeys, addKeys, removeKeys, selectCol, deselectCol } from "../../reduxStateManager/actions";

function VizOptions() {

    /*in questo componente voglio:
    - recuperare lo stato (globale) iniziale della tabella, da cui far partire la visualizzazione e su cui posso poi fare operazioni.
    - fare uno stato iniziale (locale) delle keys originali. 
    - a partire dallo stato iniziale delle keys voglio poter fare delle operazioni, e inviarlo ad uno stato globale delle keys definive . 
    */
    //importo dispatcher
    const dispatch = useDispatch();

    const dispatchKeys = (keysToLoad) => {
        console.log(keysToLoad);
        dispatch(loadKeys(keysToLoad));
    }
    const dispatchAddKeys = (keyToAdd, indexToAdd) => {
        dispatch(addKeys(keyToAdd, indexToAdd))
    }
    const dispatchRemoveKeys = (indexToRemove) => {
        dispatch(removeKeys(indexToRemove))
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
    const [originalKeys, setOriginalKeys] = React.useState(() => {
        const items = Object.keys(loadedTable[0]).map((key) => {
            return {
                Header: 'ciao', //<><p>{key}</p> {
                    //!checkIfColumnIsSelected(key) &&
                    //<button className={style.buttonSelect} onClick={e => { selectColClick(e, key) }}>Select</button>
                //} </>,
                accessor: parseInt(key, 10) || key,
                key: key,
            }
        }); 
        console.log(items);
        return items;
    }
    );

    /*dallo stato locale poi facciamo derivare quello globale, in questo useffect metto anche la creazione degli input */
    React.useEffect(
        () => {
            console.log(originalKeys);
            dispatchKeys(originalKeys);
        }, [originalKeys]
    )

    // uno stato anche per le colonne selezionate
    const [selectedColToViz, setSelectedColToViz] = React.useState([]);

    // quando cambio le colonne selezionanate, cambio anche l'header da visualizzare
    React.useEffect(() => {
        setOriginalKeys(setKeys);
    }, [selectedCol])


    // questa funzione è chiamata quando cambio le colonne selezionate, per aggiornare l'header
    const setKeys = () => {
        return Object.keys(loadedTable[0]).map((key) => {
            return {
                Header: <><p>{key}</p> {
                    !checkIfColumnIsSelected(key) &&
                    <button className={style.buttonSelect} onClick={e => { selectColClick(e, key) }}>Select</button>
                } </>,
                accessor: parseInt(key, 10) || key,
                key: key,
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


    React.useEffect(() => {
        setSelectedColToViz(selectedCol.map(col => {
            return (
                <li key={col}>
                    {col}
                    <button onClick={e => { deselectColClick(e, col) }}>Deselect</button>
                </li>
            )
        }))
    }, [selectedCol]);


    return (
        <div className={style.toVisualDiv}>
            <h3>Selected Columns:</h3>
            {selectedColToViz}
        </div>
    )
}



export default VizOptions;