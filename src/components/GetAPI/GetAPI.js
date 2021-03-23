import React from "react";
import style from "./GetAPI.module.css";
import { csvJSON, ssvJSON, jsonJSON } from "../../logicModules/formatConverter/converter";
import { useDispatch } from "react-redux";
/*importo l'action per caricare i dati nel redux storage */
import { loadTable, loadKeys, delSel } from "../../reduxStateManager/actions";
import axios from "axios";

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

    const months = [{ name: "Gennaio", value: "01" }, { name: "Febbraio", value: "02" }, { name: "Marzo",  value: "03" }, 
    { name: "Aprile",value: "04"}, { name: "Maggio", value: "05" }, { name: "Giugno", value: "06" },
    { name: "Luglio", value: "07"}, { name: "Agosto", value: "08" }, { name: "Settembre", value: "09" },
     { name: "Ottobre", value: "10" }, { name: "Novembre", value: "11" }, { name: "Dicembre", value: "12"},
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
        }
    }

    const createKeys = (table) => {
        const items = Object.keys(table[0]).map((key) => {
            return {
                Header:<p>{key}</p> ,
                accessor: parseInt(key, 10) || key,
                key: key,
                show: true,
                id: key,
            }
        }); 
        return items;
    }

    function getTableData() {
        switch (dataSet) {
            case "meteo":
                setIsLoaded("loading");
                axios.get(`http://localhost:3001/meteo/${region}/${year}/${month}/${day}`)
                    .then((res) => {
                        dispatchLoad(res.data.data);
                        dispatchKeys(createKeys(res.data.data));
                        dispatchDeleteSel();
                        setIsLoaded("loaded");
                    })
                    .catch((err) => {
                        console.error(err);
                        setIsLoaded("error: requested data could be not available or our server could be down");
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
                        setIsLoaded("loaded");
                    })
                    .catch((err) => {
                        console.error(err);
                        setIsLoaded("error: requested data could be not available or our server could be down");
                    })
                break;
            case "saved":
                setIsLoaded("loading");
                axios.get(`http://localhost:3001/saved/${savedName}`)
                    .then((res) => {
                        dispatchLoad(res.data);
                        dispatchKeys(createKeys(res.data.data));
                        dispatchDeleteSel();
                        setIsLoaded("loaded");
                    })
                    .catch((err) => {
                        console.error(err);
                        setIsLoaded("error: requested data could be not available or our server could be down");
                    })
                break;
        }
    }

    function getExternalData() {
        setIsLoaded("loading");
        axios.get(externalUrl)
            .then((res) => {
                switch (format) {
                    case "JSON":
                        dispatchLoad(res.data.data);
                        dispatchKeys(createKeys(res.data.data));
                        dispatchDeleteSel();
                        setIsLoaded("loaded");
                        break;
                    case "CSV":
                        dispatchLoad(csvJSON(res.data.data));
                        dispatchKeys(createKeys(csvJSON(res.data.data)));
                        dispatchDeleteSel();
                        setIsLoaded("loaded");
                        break;
                    case "SSV":
                        dispatchLoad(ssvJSON(res.data.data));
                        dispatchKeys(createKeys(ssvJSON(res.data.data)));
                        dispatchDeleteSel();
                        setIsLoaded("loaded");
                        break;
                }
            })
            .catch((err) => {
                console.error(err);
                setIsLoaded("error: requested data could be not available or our server could be down");
            })

    }




    return (
        <>
            <h3>Get data from API</h3>
            <label>Scegli da quale server vuoi caricare i dati</label>
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
            {
                serverToLoad === "table" &&
                <div>
                    <h4>Get data from our server</h4>
                    <form className={style.getMyServerFrom} >
                        <label >Scegli la banca dati:</label>
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
                        <br />
                        {
                            (dataSet === "meteo" || dataSet === "covid") &&
                            <div>
                                <select onChange={(e) => {setRegion(e.target.value); console.log(e.target.value)}}>
                                    {regionOptions}
                                </select>
                                <span>/</span>
                                <select onChange={(e) => {setYear(e.target.value); console.log(e.target.value)}}>
                                    <option value="2020">
                                        2020
                                    </option>
                                    <option value="2021">
                                        2021
                                    </option>
                                </select>
                                <span>/</span>
                                <select onChange={(e) => {setMonth(e.target.value); console.log(e.target.value) }}>
                                    {monthOptions}
                                </select>
                                <span>/</span>
                                <input type="number" onChange={(e)=>{setDay(e.target.value)}}/>
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
                        <label>Choose format</label>
                        <select className={style.formatSelect} value={format} onChange={(e) => setFormat(e.target.value)}>
                            <option value="JSON" default>JSON</option>
                            <option value="CSV" default>CSV</option>
                            <option value="SSV" default>SSV</option>
                        </select>
                        <br />

                        <input type="text" placeholder="URL..." onChange={e => setExternalUrl(e.target.value)} />
                        <br />
                    </form>
                </div>
            }
            <div className={style.submitButton} onClick={handleSubmit}>GET</div>
            <p>Loading state: {isLoaded}</p>
        </>
    )
}

export default GetAPI;