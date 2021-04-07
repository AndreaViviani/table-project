import React from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { loadTable, loadKeys, updateRow, setHasBeenExtended } from "../../reduxStateManager/actions";
import FillRow from "../FillRow/FillRow";


function MergeTable(props) {

    const { isTableLoading, onTableLoadingChange } = props;

    const loadedTable = useSelector(state => state.loadedTable);
    const selectedCol = useSelector(state => state.selectedCol);
    const loadedKeys = useSelector(state => state.loadedKeys);
    const hasExtended = useSelector(state => state.hasExtended);

    //stato select 
    const [wantToExtend, setWantToExtend] = React.useState(false);

    // stato che contiene il datset da caricare
    const [dataset, setDataset] = React.useState('');

    var dataReady = false;

    const myNewData = [];

    const dispatch = useDispatch();

    const dispatchLoad = (data) => {
        dispatch(
            loadTable(data))
    };
    const dispatchKeys = (keysToLoad) => {
        dispatch(loadKeys(keysToLoad));
    }

    function handleChange(e) {
        setDataset(e.target.value);
    }

    const dispatchUpdate = (index, row) => {
        dispatch(updateRow(index, row))
    };

    const dispatchExtended = (value) => {
        dispatch(setHasBeenExtended(value));
    }

    // this useffect add button to fill rows with data 
    React.useEffect(() => {
        if (hasExtended) {
            const cells = []
            for (const col of loadedKeys) {
                cells.push(col.accessor);
            }
            for (let i = 0; i < loadedTable.length; i++) {
                let newRow = {};
                Object.assign(newRow, loadedTable[i]);
                for (const cell of cells) {
                    if (!loadedTable[i][cell]) {
                        newRow[cell] = <FillRow row={newRow} isTableLoading={isTableLoading} onTableLoadingChange={(isTableLoading) => { onTableLoadingChange(isTableLoading) }}></FillRow>;
                    }
                }
                dispatchUpdate(i, newRow);
            }
        } else {
            //when click to uniform to set unextended i want to uniform header column
            console.log("ciao");
            dispatchKeys((loadedKeys).map((key) => {
                return {
                    Header: key.Header,
                    accessor: key.accessor,
                    key: key.key,
                    show: key.show,
                    id: key.id,
                    added: false,
                }
            }));
        }

    }, [hasExtended])







    // funzione chimata quando voglio unire l'attuale tabella con i dati meteo
    function getMeteo() {
        //dico intanto che la tabella sta caricando
        //poi ciclo sulle righe e per ognuna faccio una chiamata al server
        onTableLoadingChange(true);
        for (let i = 0; i < loadedTable.length; i++) {
            let myNewObj = {};
            const data = loadedTable[i].data;
            const splittedData = data.split('-');
            let provincia = loadedTable[i].denominazione_provincia;
            let year = splittedData[0];
            let month = splittedData[1];
            let day = splittedData[2].split('T')[0];
            const url = `http://localhost:3001/meteo/single-line/${provincia}/${year}/${month}/${day}`;
            // riempio intanto l'oggetto con i dati delle colonne già presenti selezionate
            for (const col of selectedCol) {
                myNewObj[col] = loadedTable[i][col];
            }
            axios.get(url)
                .then(
                    (res) => {

                        myNewObj = { ...myNewObj, ...res.data };
                        dispatchUpdate(i, myNewObj);
                        myNewData.push(myNewObj);
                        if (i === (loadedTable.length - 1)) {
                            // se ho recuperato l'ultima riga carico i dati nello stato
                            //per estrarre le keys devo accertarmi che la riga sia completa
                            for (let x = 0; x < myNewData.length; x++) {
                                if ((Object.keys(myNewData[x]).length) > selectedCol.length) {
                                    //estraggo le keys
                                    dispatchKeys(Object.keys(myNewData[x]).map((key) => {
                                        return {
                                            Header: <p>{key}</p>,
                                            accessor: parseInt(key, 10) || key,
                                            key: key,
                                            show: true,
                                            id: key,
                                            added: selectedCol.includes(key) ? false : true,
                                        }
                                    }));
                                    dispatchExtended(true);
                                    onTableLoadingChange(false);
                                    break;
                                }
                            }



                        }
                    }
                )
                .catch((err) => {
                    console.log(err);
                })
        }
    }

    React.useEffect(() => {
        if (dataReady) {
            dispatchLoad(myNewData);
        }
    }, [dataReady])



    function selectDataset() {
        switch (dataset) {
            case "meteo":
                getMeteo();
                break;
            default:
                alert('select a valid dataset');
        }
    }

    return (
        <>{!hasExtended &&
            <div style={{ display: "inline-block" }}>
                <button onClick={() => {
                    setWantToExtend(true);
                }}>
                    Extend with selected columns
        </button>
                {
                    wantToExtend &&
                    <>
                        <div className={"customSelect"}>
                            <select onChange={(e) => {
                                handleChange(e)
                            }}>
                                <option disabled selected value="">select dataset</option>
                                <option value='meteo'>
                                    Meteo.it
                </option>
                                <option value=''>
                                    Altro dataset
                </option>
                                <option value=''>
                                    Altro dataset
                </option>
                            </select>
                        </div>

                        <button onClick={() => {
                            selectDataset();
                        }}>Extend</button>
                    </>
                }

            </div>
        }{
                hasExtended &&
                <button onClick={(e) => { dispatchExtended(false); setWantToExtend(false) }}>Uniform table</button>
            }

        </>
    )
}

export default MergeTable;