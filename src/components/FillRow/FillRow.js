import React from "react";
import axios from "axios";
import Loader from "react-loader-spinner";
import style from "./FillRow.module.css";
import { useSelector, useDispatch } from "react-redux";
import { loadTable } from "../../reduxStateManager/actions";

function FillRow(props) {

    const { row, isTableLoading, onTableLoadingChange} = props;

    const [panelIsOpen, setPanelIsOpen] = React.useState(false);
    const [panelIsLoading, setPanelIsLoading] = React.useState(false);
    const [cities, setCities] = React.useState([]);

    const [formattedCities, setFormattedCities] = React.useState([]);

    const loadedTable = useSelector(state => state.loadedTable);

    const dispatch = useDispatch();

    const dispatchLoad = (data) => {
        console.log('loado1')
        dispatch(loadTable(data))
    };

    // sort cities in base alla distanza
    function compare(a, b) {
        if (a.dist < b.dist) {
            return -1;
        }
        if (a.dist > b.dist) {
            return 1;
        }
        return 0;
    }

    //ask the requested data and fill the table
    function fillRow(city, row) {
        const data = row.data;
        const splittedData = data.split('-');
        let provincia = row.denominazione_provincia;
        let year = splittedData[0];
        let month = splittedData[1];
        let day = splittedData[2].split('T')[0];
        onTableLoadingChange(true);
        axios.get(`http://localhost:3001/meteo/single-line/${city}/${year}/${month}/${day}`)
            .then((res) => {
                //now i update my table data
                const newLoadedTable = loadedTable;
                for (let i = 0; i < newLoadedTable.length; i++) {
                    if (newLoadedTable[i].denominazione_provincia === provincia) {
                        const myNewObj = { ...newLoadedTable[i], ...res.data };
                        newLoadedTable[i] = myNewObj;
                        console.log(newLoadedTable);
                        dispatchLoad(newLoadedTable);
                        setPanelIsOpen(false);
                        onTableLoadingChange(false);
                        break;
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            })
    }


    // prepare markup when receive cities
    React.useEffect(() => {
        cities.sort(compare);
        const newFormattedCities = cities.map((city) => {
            return (
                <li key={city.comune} className={style.citiesList}>
                    {city.comune}:  {city.dist.toString().substring(0, 4)}km
                    <button onClick={(e) => { e.preventDefault(); fillRow(city.comune, row) }}>Fill</button>
                </li>
            )
        })
        setFormattedCities(newFormattedCities);
    }, [cities])

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
            .then((res) => {
                setCities(res.data);
                setPanelIsLoading(false);
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <>
            { panelIsOpen &&
                <div className={"overlay"} onClick={(e) => { setPanelIsOpen(false) }}>
                    <div className={"panel"} onClick={(e) => { e.stopPropagation() }}>
                        {!panelIsLoading &&
                            <>
                                <h3>
                                    Choose city:
                                </h3>
                                {formattedCities}
                            </>
                        }
                        {panelIsLoading &&
                            <>
                                <Loader
                                    type="Puff"
                                    color="#00BFFF"
                                    height={300}
                                    width={300}
                                />
                            </>

                        }

                    </div>
                </div>
            }

            <button onClick={(e) => { e.stopPropagation(); setPanelIsLoading(true); setPanelIsOpen(true); addData(row); }}>Add data</button>
        </>
    )
}

export default FillRow;