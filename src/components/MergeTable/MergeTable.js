import React from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { loadTable, loadKeys } from "../../reduxStateManager/actions";


function MergeTable(props) {

    const { isTableLoading, onTableLoadingChange } = props;

    const loadedTable = useSelector(state => state.loadedTable);
    const selectedCol = useSelector(state => state.selectedCol);

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

    // funzione chimata quando voglio unire l'attuale tabella con i dati meteo
    function getMeteo() {
        //dico intanto che la tabella sta caricando
        //poi ciclo sulle righe e per ognuna faccio una chiamata al server
        onTableLoadingChange(true);
        for (let i = 0; i < loadedTable.length; i++) {
            let myNewObj = {};
            const data = loadedTable[i].data;
            const splittedData = data.split('-');
            let regione = loadedTable[i].denominazione_regione;
            let provincia = loadedTable[i].denominazione_provincia;
            let year = splittedData[0];
            let month = splittedData[1];
            let day = splittedData[2].split('T')[0];
            const url = `http://localhost:3001/meteo/${regione}/${provincia}/${year}/${month}/${day}`;
            // riempio intanto l'oggetto con i dati delle colonne già presenti selezionate
            for (const col of selectedCol) {
                myNewObj[col] = loadedTable[i][col];
            }
            axios.get(url)
                .then(
                    (res) => {
                        console.log(res.data);
                        myNewObj = { ...myNewObj, ...res.data };
                        myNewData.push(myNewObj);
                        console.log(i);
                        if (i === (loadedTable.length - 1)) {
                            // se ho recuperato l'ultima riga carico i dati nello stato
                            dispatchKeys(Object.keys(myNewData[0]).map((key) => {
                                console.log(selectedCol.includes(key));
                                return {
                                    Header: <p>{key}</p>,
                                    accessor: parseInt(key, 10) || key,
                                    key: key,
                                    show: true,
                                    id: key,
                                    added: selectedCol.includes(key) ? false : true,
                                }
                            }));
                            dispatchLoad(myNewData);
                            onTableLoadingChange(false);
                        }
                    }
                )
                .catch((err) => {
                    console.log(err);
                })
            console.log(i);
        }
    }

    React.useEffect(() => {
        if (dataReady) {
            dispatchLoad(myNewData);
        }
    }, [dataReady])



    function selectDataset() {
        console.log(dataset);
        switch (dataset) {
            case "meteo":
                getMeteo();
                break;
            default:
                alert('select a valid dataset');
        }
    }

    return (
        <>
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
        </>
    )
}

export default MergeTable;