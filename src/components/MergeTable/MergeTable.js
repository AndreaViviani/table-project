import React from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { loadTable, loadKeys } from "../../reduxStateManager/actions";
import produce from "immer";


function MergeTable() {

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

    function getMeteo() {
        console.log("getMeteo");
        for (let i = 0; i < loadedTable.length; i++) {
            let myNewObj = {};
            const data = loadedTable[i].data;
            const splittedData = data.split('-');
            let regione = loadedTable[i].denominazione_regione;
            let provincia = loadedTable[i].denominazione_provincia;
            let year = splittedData[0];
            let month = splittedData[1];
            let day = splittedData[2].split('T')[0];
            const url = `http://localhost:3001/${regione}/${provincia}/${year}/${month}/${day}`;
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
                            dispatchKeys(Object.keys(myNewData[0]).map((key) => {
                                return {
                                    Header:<p>{key}</p> ,
                                    accessor: parseInt(key, 10) || key,
                                    key: key,
                                    show: true,
                                    id: key,
                                }
                            }));
                            dispatchLoad(myNewData);
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
            console.log(myNewData);
            //dispatchKeys(Object.keys(myNewData[0]));
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
            <button onClick={() => {
                setWantToExtend(true);
            }}>
                Extend with selected columns
        </button>
            {
                wantToExtend &&
                <>
                    <select onChange={(e) => {
                        handleChange(e)
                    }}>
                        <option value="">select dataset</option>
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
                    <button onClick={() => {
                        selectDataset();
                    }}>Extend</button>
                </>
            }

        </>
    )
}

export default MergeTable;