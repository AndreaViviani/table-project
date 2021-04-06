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

    //i'll use this function to add data to empty row
    function addData(row) {
        console.log('ciao');
        const data = row.data;
        const splittedData = data.split('-');
        let regione = row.denominazione_regione;
        let provincia = row.denominazione_provincia;
        let year = splittedData[0];
        let month = splittedData[1];
        let day = splittedData[2].split('T')[0];
        const url = `http://localhost:3001/get-options/meteo/${provincia}/${year}/${month}/${day}/10`;
        axios.get(url)
            .then((res)=>{
                console.log(res.data);
            })
            .catch((err)=>{
                console.log(err);
            })
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
                        myNewObj = { ...myNewObj, ...res.data };
                        myNewData.push(myNewObj);
                        if (i === (loadedTable.length - 1)) {
                            // se ho recuperato l'ultima riga carico i dati nello stato
                            //per estrarre le keys devo accertarmi che la riga sia completa
                            console.log('ciao');
                            for (let x = 0; x < myNewData.length; x++) {
                                console.log(Object.keys(myNewData[x]).length);
                                if ((Object.keys(myNewData[x]).length) > selectedCol.length) {
                                    //estraggo le keys
                                    console.log(Object.keys(myNewData[x]));
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
                                    // faccio un controllo e riempio le righe vuote con un azione
                                    for (const row of myNewData) {
                                        for (const cell of Object.keys(myNewData[x])) {
                                            if (row[cell]) {
                                                continue;
                                            }
                                            row[cell] = <button onClick={(e) => {e.stopPropagation(); addData(row); console.log('add data') }}>Add data</button>;
                                        }
                                    }

                                    dispatchLoad(myNewData);
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