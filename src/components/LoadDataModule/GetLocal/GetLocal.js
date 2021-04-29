import React from "react";
import style from "./GelLocal.module.css";
import { useDispatch, useSelector } from "react-redux";
import { loadTable, loadKeys, delSel, loadName, setHasBeenExtended } from "../../../reduxStateManager/actions";
import { csvJSON, ssvJSON, jsonJSON} from "../../../logicModules/formatConverter/converter";
import Loader from "react-loader-spinner";
import { Link } from "react-router-dom";



function GetLocal() {
    /*handle loading state and format */
    const [loadingState, setLoadingState] = React.useState("Not loaded");
    const [format, setFormat] = React.useState("JSON");

    /*Handle changing format */
    function handleChangeFormat(e) {
        setFormat(e.target.value);
    }


    /*setting function to dispatch data and calling it in a useeffect executed e when selectedFile changes */
    const dispatch = useDispatch();

    const loadedTable = useSelector(state => state.loadedTable);

    const dispatchLoad = (data) => {
        dispatch(loadTable(data));
    }
    const dispatchKeys = (keysToLoad) => {
        dispatch(loadKeys(keysToLoad));
    }

    const dispatchDeleteSel = () => {
        dispatch(delSel());
    }
    const dispatchLoadName = (nameToSave) => {
        dispatch(loadName(nameToSave));
    }
    const dispatchExtended = (value) => {
        dispatch(setHasBeenExtended(value));
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

    //converto a seconda del formato scelto
    function handleFile(e) {
        setLoadingState("Loading")
        var file = e.target.files[0];
        let fileName = file.name.split(" ").join("-");
        console.log(fileName);
        var reader = new FileReader();
        reader.onload = function (event) { //on loading file.
            console.log(event.target.result);
            var unconverteFile = event.target.result;
            var convertedFile;
            switch (format) {
                case "JSON":
                    convertedFile = jsonJSON(unconverteFile);
                    fileName = fileName.substring(0, fileName.indexOf(".json"));
                    break;
                case "CSV":
                    convertedFile = csvJSON(unconverteFile);
                    fileName = fileName.substring(0, fileName.indexOf(".csv"));
                    break;
                case "SSV":
                    convertedFile = ssvJSON(unconverteFile);
                    fileName = fileName.substring(0, fileName.indexOf(".csv"));
                    break
                default:
                    convertedFile = jsonJSON(unconverteFile);
            }
            dispatchDeleteSel();
            dispatchLoad(convertedFile);
            setLoadingState("Loaded");
            dispatchKeys(createKeys(convertedFile));
            dispatchLoadName(fileName);
            dispatchExtended(false);
        }
        reader.readAsText(file);
    }


    return (
        <> {
            loadingState === "Not loaded" &&
            <div>
                <h3>Get data from File System</h3>
                <label>Choose format: </label>
                <div className={"customSelect"}>
                    <select className={style.formatSelect} value={format} onChange={handleChangeFormat}>
                        <option value="JSON" default>JSON</option>
                        <option value="CSV" default>CSV</option>
                        <option value="SSV" default>SSV</option>
                    </select>
                </div>

                <br />
                <div className={"customFile"}>
                    <p className={"fileText"}>Scegli file</p>
                    <input type="file" onChange={e => handleFile(e)} />
                </div>
                
            </div>
        }{
                loadingState === "Loading" &&
                <Loader
                    type="Puff"
                    color="#00BFFF"
                    height={100}
                    width={100}
                />
            }
            { loadingState === "Loaded" &&
                <div>
                    <p>
                        Your data have been loaded. View your table or go back and load a different dataset.
                    </p>
                    <div className={style.buttonStyle} onClick={() => { setLoadingState("Not loaded") }}>Go Back</div>
                    <Link to="/view-table">
                        <div className={style.buttonStyle}>View your Table</div>
                    </Link>
                </div>
            }


        </>
    )
}

export default GetLocal;