import React from "react";
import style from "./GetAPI.module.css";
import { csvJSON, ssvJSON, jsonJSON } from "../../logicModules/formatConverter/converter";
import { useDispatch } from "react-redux";
/*importo l'action per caricare i dati nel redux storage */
import { loadTable, selectCol } from "../../reduxStateManager/actions";

function GetAPI() {
    /*Use useSelector to display my redux state */
    const dispatch = useDispatch();

    /*I have a function do dispach my loaded table, this is called when i load data*/
    const dispatchLoad = (data) => {
        dispatch(loadTable(data))
    }

    /*Some states for the form (API myserver)*/
    const [region, setRegion] = React.useState("Lombardia");
    const [year, setYear] = React.useState("2020");
    const [month, setMonth] = React.useState("Maggio");
    const [day, setDay] = React.useState("15");

    /*This states are relative to the external API call */
    const [externalUrl, setExternalUrl] = React.useState("");
    const [format, setFormat] = React.useState("JSON");

    // state dataset to retrieve
    const [dataSet, setDataSet] = React.useState('meteo');

    //name of the saved table to retrieve
    const [savedName, setSavedName] = React.useState("");

    const [serverToLoad, setServerToLoad] = React.useState('table');

    /*Loading state for external API */
    const [loadingExt, setLoadingExt] = React.useState("Not Loaded");

    /*Loading state for our API */
    const [loadingOur, setLoadingOur] = React.useState("Not Loaded");

    /*Handle changing format */
    function handleChangeFormat(e) {
        setFormat(e.target.value);
    }



    /*This function handle external submit */
    function handleExtSubmit() {
        const extUrl = externalUrl;
        setLoadingExt("Loading");
        fetch(extUrl)
            .then((response) => response.text())
            .then((data) => {
                switch (format) {
                    case "JSON":
                        dispatchLoad(jsonJSON(data));
                        break;
                    case "SSV":
                        dispatchLoad(ssvJSON(data));
                        break;
                    case "CSV":
                        dispatchLoad(csvJSON(data));
                        break;
                    default:
                        dispatchLoad(jsonJSON(data));
                }
                setLoadingExt("Loaded");
            })
    }

    /*This fucntion hande (our server) submit, concatenate the string of the url and make the call to the server*/
    function handleSubmit() {
        var myGetUrl = `http://localhost:3001/meteo/${region}/${year}/${month}/${day}`;
        setLoadingOur("Loading...")
        fetch(myGetUrl, {
            headers: {
                "Accept": "text/csv"
            }
        })
            .then((response) => response.text())
            .then((data) => {
                data = csvJSON(data);
                console.log(data);
                dispatchLoad(data);
                setLoadingOur("Loaded")
            })
    }

    function handleChangeSelect(e) {
        setDataSet(e.target.value);
    }


    return (
        <>
            <h3>Get data from API</h3>
            <label for="chooseServ">Scegli da quale server vuoi caricare i dati</label>
            <select onChange={(e)=>{
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
                        <label for="db">Scegli la banca dati:</label>
                        <select onChange={(e) => {
                            handleChangeSelect(e)
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
                            dataSet === "meteo" &&
                            <div>
                                <input type="text" placeholder="Region" onChange={e => setRegion(e.target.value)} />
                                <span>/</span>
                                <input type="text" placeholder="Year" onChange={e => setYear(e.target.value)} />
                                <span>/</span>
                                <input type="text" placeholder="Month" onChange={e => setMonth(e.target.value)} />
                                <span>/</span>
                                <input type="text" placeholder="Day" onChange={e => setDay(e.target.value)} /> <br />
                            </div>
                        }
                        {
                            dataSet === "saved" &&
                            <div>
                                <label for="savedName">Inserisci il nome della tabella salvata: </label>
                                <input id="saveName" type="text" onChange={(e) => {
                                    setSavedName(e.target.value);
                                }} />
                            </div>
                        }


                        <div className={style.submitButton} onClick={handleSubmit}>GET</div>
                        <p>Loading state: <span>{loadingOur}</span></p>
                    </form>
                </div>
            }
            {
                serverToLoad === "others" &&
                <div>
                    <h4>Get data from external API</h4>
                    <form>
                        <label>Choose format</label>
                        <select className={style.formatSelect} value={format} onChange={handleChangeFormat}>
                            <option value="JSON" default>JSON</option>
                            <option value="CSV" default>CSV</option>
                            <option value="SSV" default>SSV</option>
                        </select>
                        <br />

                        <input type="text" placeholder="URL..." onChange={e => setExternalUrl(e.target.value)} />
                        <br />
                        <div className={style.submitButton} onClick={handleExtSubmit}>GET</div>
                        <p>Loading state: <span>{loadingExt}</span></p>
                    </form>
                </div>
            }
        </>
    )
}

export default GetAPI;