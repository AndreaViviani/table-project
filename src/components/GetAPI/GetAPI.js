import React from "react";
import style from "./GetAPI.module.css";
import { csvJSON, ssvJSON } from "../../logicModules/formatConverter/converter";
import { useDispatch } from "react-redux";
/*importo l'action per caricare i dati nel redux storage */
import { loadTable, loadKeys, delSel, loadName } from "../../reduxStateManager/actions";
import axios from "axios";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";

function GetAPI() {
    /*Use useSelector to display my redux state */
    const dispatch = useDispatch();

    /*I have a function do dispach my loaded table, this is called when i load data*/
    const dispatchLoad = (data) => {
        dispatch(loadTable(data))
    }

    const dispatchKeys = (keysToLoad) => {
        dispatch(loadKeys(keysToLoad));
    }
    const dispatchDeleteSel = () => {
        dispatch(delSel());
    }
    const dispatchLoadName = (nameToSave) => {
        dispatch(loadName(nameToSave))
    }

    /*Some states for the form (API myserver)*/
    const [region, setRegion] = React.useState("Valle-d'Aosta");
    const [year, setYear] = React.useState("2020");
    const [month, setMonth] = React.useState("01");
    const [day, setDay] = React.useState("01");

    /*This states are relative to the external API call */
    const [externalUrl, setExternalUrl] = React.useState("");
    const [format, setFormat] = React.useState("JSON");

    // state dataset to retrieve
    const [dataSet, setDataSet] = React.useState('meteo');

    //name of the saved table to retrieve
    const [savedName, setSavedName] = React.useState("");

    const [serverToLoad, setServerToLoad] = React.useState('table');

    const [isLoaded, setIsLoaded] = React.useState("Not loaded");

    //name of the esternal table i whant to retrieve

    const [extName, setExtName] = React.useState("")

    const regions = [{ name: "Valle d'Aosta", value: "Valle-d'Aosta" }, { name: "Piemonte", value: "Piemonte" }, { name: "Liguria", value: "Liguria" },
    { name: "Lombardia", value: "Lombardia" }, { name: "Trentino-Alto Adige", value: "Trentino-Alto-Adige" }, { name: "Veneto", value: "Veneto" }, { name: "Friuli-Venezia Giulia", value: "Friuli-Venezia-Giulia" },
    { name: "Emilia Romagna", value: "Emilia-Romagna" }, { name: "Toscana", value: "Toscana" }, { name: "Umbria", value: "Umbria" }, { name: "Lazio", value: "Lazio" }, { name: "Abruzzo", value: "Abruzzo" },
    { name: "Molise", value: "Molise" }, { name: "Campania", value: "Campania" }, { name: "Puglia", value: "Puglia" }, { name: "Basilicata", value: "Basilicata" }, { name: "Calabria", value: "Calabria" },
    { name: "Sicilia", value: "Sicilia" }, { name: "Sardegna", value: "Sardegna" }
    ]

    const regionOptions = regions.map((region) => {
        return (
            <option value={region.value} key={region.value}>
                {region.name}
            </option>
        )
    })

    const months = [{ name: "Gennaio", value: "01" }, { name: "Febbraio", value: "02" }, { name: "Marzo", value: "03" },
    { name: "Aprile", value: "04" }, { name: "Maggio", value: "05" }, { name: "Giugno", value: "06" },
    { name: "Luglio", value: "07" }, { name: "Agosto", value: "08" }, { name: "Settembre", value: "09" },
    { name: "Ottobre", value: "10" }, { name: "Novembre", value: "11" }, { name: "Dicembre", value: "12" },
    ]

    const monthOptions = months.map((month) => {
        return (
            <option value={month.value} key={month.name}>
                {month.name}
            </option>
        )
    })

    /*This fucntion hande (our server) submit, concatenate the string of the url and make the call to the server*/
    function handleSubmit() {
        switch (serverToLoad) {
            case "table":
                getTableData();
                break;
            case "others":
                getExternalData();
                break;
            default:
                getTableData();
        }
    }

    const createKeys = (table) => {
        const items = Object.keys(table[0]).map((key) => {
            return {
                Header: <p>{key}</p>,
                accessor: parseInt(key, 10) || key,
                key: key,
                show: true,
                id: key,
            }
        });
        return items;
    }

    // a seconda dei dati che voglio caricare faccio una richiesta diversa al server
    function getTableData() {
        switch (dataSet) {
            case "meteo":
                setIsLoaded("loading");
                console.log(`http://localhost:3001/meteo/${region}/${year}/${month}/${day}`);
                axios.get(`http://localhost:3001/meteo/${region}/${year}/${month}/${day}`)
                    .then((res) => {
                        dispatchLoad(res.data.data);
                        dispatchKeys(createKeys(res.data.data));
                        dispatchDeleteSel();
                        dispatchLoadName(`meteo_${region}_${day}-${month}-${year}`)
                        setIsLoaded("Loaded");
                    })
                    .catch((err) => {
                        console.error(err);
                        setIsLoaded("error");
                    })
                break;
            case "covid":
                setIsLoaded("loading");
                console.log('ciao');
                axios.get(`http://localhost:3001/covid/${region}/${year}/${month}/${day}`)
                    .then((res) => {
                        dispatchLoad(res.data.data);
                        dispatchKeys(createKeys(res.data.data));
                        dispatchDeleteSel();
                        dispatchLoadName(`Covid_${region}_${day}-${month}-${year}`)
                        setIsLoaded("Loaded");
                    })
                    .catch((err) => {
                        console.error(err);
                        setIsLoaded("error");
                    })
                break;
            case "saved":
                setIsLoaded("loading");
                axios.get(`http://localhost:3001/saved/${savedName}`)
                    .then((res) => {
                        console.log(res.data.data);
                        dispatchLoad(res.data.data);
                        dispatchKeys(createKeys(res.data.data));
                        dispatchDeleteSel();
                        dispatchLoadName(`${savedName}`)
                        setIsLoaded("Loaded");
                    })
                    .catch((err) => {
                        console.error(err);
                        setIsLoaded("error");
                    })
                break;
        }
    }

    // chiedo i dati ad API esterna e converto a seconda del formato
    function getExternalData() {
        setIsLoaded("loading");
        axios.get(externalUrl)
            .then((res) => {
                switch (format) {
                    case "JSON":
                        dispatchLoad(res.data.data);
                        dispatchKeys(createKeys(res.data.data));
                        dispatchDeleteSel();
                        dispatchLoadName(extName);
                        setIsLoaded("Loaded");
                        break;
                    case "CSV":
                        dispatchLoad(csvJSON(res.data.data));
                        dispatchKeys(createKeys(csvJSON(res.data.data)));
                        dispatchDeleteSel();
                        dispatchLoadName(extName);
                        setIsLoaded("Loaded");
                        break;
                    case "SSV":
                        dispatchLoad(ssvJSON(res.data.data));
                        dispatchKeys(createKeys(ssvJSON(res.data.data)));
                        dispatchDeleteSel();
                        dispatchLoadName(extName);
                        setIsLoaded("Loaded");
                        break;
                }
            })
            .catch((err) => {
                console.error(err);
                setIsLoaded("error");
            })

    }

    function convertDay(day) {
        let returnValue = ""
        if (day.length === 1) {
            returnValue = `0${day}`;
        } else {
            returnValue = day;
        }
        return returnValue;
    }




    return (
        <> { isLoaded === "Not loaded" &&
            <div>
                <h3>Get data from API</h3>
                <label>Scegli da quale server vuoi caricare i dati:  </label>
                <div className={"customSelect"}>
                    <select onChange={(e) => {
                        setServerToLoad(e.target.value)
                    }}>
                        <option value="table">
                            TableServer
                </option>
                        <option value="others">
                            Altri
                </option>
                    </select>
                </div>


                {
                    serverToLoad === "table" &&
                    <div>
                        <h4>Get data from our server</h4>
                        <form className={style.getMyServerFrom} >
                            <label >Scegli la banca dati: </label>
                            <div className={"customSelect"}>
                                <select onChange={(e) => {
                                    setDataSet(e.target.value)
                                }}>
                                    <option value="meteo">
                                        Meteo
                    </option>
                                    <option value="covid">
                                        Covid
                    </option>
                                    <option value="saved">
                                        Saved Table
                    </option>
                                </select>
                            </div>


                            <br />
                            {
                                (dataSet === "meteo" || dataSet === "covid") &&
                                <div className={style.paramsDiv}>
                                    <label>Seleziona una regione: </label>
                                    <div className={"customSelect"}>
                                        <select onChange={(e) => { setRegion(e.target.value); console.log(e.target.value) }}>
                                            {regionOptions}
                                        </select>
                                    </div>


                                    <br />
                                    <label>Seleziona un anno: </label>
                                    <div className={"customSelect"}>
                                        <select onChange={(e) => { setYear(e.target.value); console.log(e.target.value) }}>
                                            <option value="2020">
                                                2020
                                    </option>
                                            <option value="2021">
                                                2021
                                    </option>
                                        </select>
                                    </div>

                                    <br />
                                    <label>Seleziona un mese: </label>
                                    <div className={"customSelect"}>
                                        <select onChange={(e) => { setMonth(e.target.value); console.log(e.target.value) }}>
                                            {monthOptions}
                                        </select>
                                    </div>

                                    <br />
                                    <label>Seleziona un giorno: </label>
                                    <input type="number" defaultValue={1} onChange={(e) => { setDay(convertDay(e.target.value)) }} />
                                </div>
                            }
                            {
                                dataSet === "saved" &&
                                <div>
                                    <label>Inserisci il nome della tabella salvata: </label>
                                    <input type="text" onChange={(e) => {
                                        setSavedName(e.target.value);
                                    }} />
                                </div>
                            }
                            {
                                dataSet === "covid" &&
                                <div>

                                </div>
                            }
                        </form>
                    </div>
                }
                {
                    serverToLoad === "others" &&
                    <div>
                        <h4>Get data from external API</h4>
                        <form>
                            <label>Choose format:</label>
                            <div className={"customSelect"}>
                                <select className={style.formatSelect} value={format} onChange={(e) => setFormat(e.target.value)}>
                                    <option value="JSON" default>JSON</option>
                                    <option value="CSV" default>CSV</option>
                                    <option value="SSV" default>SSV</option>
                                </select>
                            </div>

                            <br />
                            <label>Inserisci l'url: </label>
                            <input type="text" placeholder="URL..." onChange={e => setExternalUrl(e.target.value)} />
                            <br />
                            <label>
                                Inserisci il nome che vuoi dare alla tua tabella: 
                            </label>
                            <input type="text" placeholder="name.." onChange={e => setExtName(e.target.value)} />
                        </form>
                    </div>
                }
                <div className={style.submitButton} onClick={handleSubmit}>GET</div>
            </div>
        }
            {
                isLoaded === "loading" &&
                <Loader
                    type="Puff"
                    color="#00BFFF"
                    height={100}
                    width={100}
                />
            }
            { isLoaded === "Loaded" &&
                <div>
                    <p>
                        Your data have been loaded. View your table or go back and load a different dataset.
                    </p>
                    <div className={style.buttonStyle} onClick={() => { setIsLoaded("Not loaded") }}>Go Back</div>
                    <Link to="/view-table">
                        <div className={style.buttonStyle}>View your Table</div>
                    </Link>
                </div>

            }
            {
                isLoaded === "error" &&
                <div>
                    <p className={style.errorMessage}>
                        An error occurred in data loading. Data could not be available or server could be down. Set different options or try later.
                </p>
                    <div className={style.buttonStyle} onClick={() => { setIsLoaded("Not loaded") }}>Go Back</div>
                </div>

            }

        </>
    )
}

export default GetAPI;