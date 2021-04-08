import React from "react";
import axios from "axios";
import Loader from "react-loader-spinner";
import style from "./FillRow.module.css";
import { useSelector, useDispatch } from "react-redux";
import { updateRow } from "../../reduxStateManager/actions";

function FillRow(props) {

    const { row, isTableLoading, onTableLoadingChange } = props;

    const [panelIsOpen, setPanelIsOpen] = React.useState(false);
    const [panelIsLoading, setPanelIsLoading] = React.useState(false);
    const [cities, setCities] = React.useState([]);
    const [areNoCities, setAreNoCities] = React.useState(false);
    const [formattedCities, setFormattedCities] = React.useState([]);
    const [manualCity, setManualCity] = React.useState("");
    const loadedTable = useSelector(state => state.loadedTable);

    const dispatch = useDispatch();

    const dispatchUpdate = (index, row) => {
        dispatch(updateRow(index, row))
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

    /*function elaborateCityName(city) {
        const splittedCity = city.split(" ");
        for (el of splitted)
    }*/

    //ask the requested data and fill the table
    function fillRow(city, row) {
        const data = row.data;
        const splittedData = data.split('-');
        let provincia = row.denominazione_provincia;
        let year = splittedData[0];
        let month = splittedData[1];
        let day = splittedData[2].split('T')[0];
        axios.get(`http://localhost:3001/meteo/single-line/${city}/${year}/${month}/${day}`)
            .then((res) => {
                //now i update my table data
                if (res.data.error) {
                    alert(res.data.error);
                }
                const newLoadedTable = loadedTable;
                for (let i = 0; i < newLoadedTable.length; i++) {
                    if (newLoadedTable[i].denominazione_provincia === provincia) {
                        /*const myNewObj = { ...newLoadedTable[i], ...res.data };
                        newLoadedTable[i] = myNewObj;
                        console.log(newLoadedTable);
                        dispatchLoad(newLoadedTable);*/
                        setPanelIsOpen(false);
                        dispatchUpdate(i, res.data);
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

    React.useEffect(() => {
        if (panelIsOpen) {
            document.body.style.overflow = "hidden";
            window.scrollTo(0, 0);
        } else {
            document.body.style.overflow = "scroll";
        }
    }, [panelIsOpen])

    //i'll use this function to add data to empty row
    function addData(row, city = "") {
        setPanelIsLoading(true);
        city = city.charAt(0).toUpperCase() + city.slice(1);
        const data = row.data;
        const splittedData = data.split('-');
        let provincia = city || row.denominazione_provincia;
        let year = splittedData[0];
        let month = splittedData[1];
        let day = splittedData[2].split('T')[0];
        const url = `http://localhost:3001/get-options/meteo/${provincia}/${year}/${month}/${day}`;
        axios.get(url)
            .then((res) => {
                console.log(res.data);
                if (res.data.error === "no cities found") {
                    setPanelIsLoading(false);
                    setAreNoCities(true);

                } else if (res.data.error && res.data.error !== "no cities found") {
                    alert("Si è verificato un errore, ritenta più tardi");
                    setPanelIsOpen(false);
                } else {
                    setAreNoCities(false);
                    setCities(res.data);
                    setPanelIsLoading(false);
                }

            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <>
            { panelIsOpen &&
                <div className={"overlay"} onClick={(e) => { setPanelIsOpen(false); setAreNoCities(false); }}>
                    <div className={"panel"} onClick={(e) => { e.stopPropagation() }}>
                        {!panelIsLoading && !areNoCities &&
                            <>
                                <h3>
                                    Choose city
                                </h3>
                                {formattedCities}
                                <h3>
                                    or
                                </h3>
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

                        }{
                            !panelIsLoading && areNoCities &&
                            <>
                                <h3>
                                    Non sono presenti città con questo nome.
                            </h3>

                            </>
                        }
                        {
                            !panelIsLoading &&

                            <>
                                <div className={style.left}>
                                    <label >Insert city name: </label>
                                    < input onChange={(e) => { setManualCity(e.target.value) }} placeholder={"Milano"} />
                                    <button onClick={(e) => { console.log("ciao"); e.stopPropagation(); addData(row, manualCity) }}>Search</button>
                                </div>


                            </>
                        }

                    </div>
                </div>
            }

            <div className={style.add} onClick={(e) => { e.stopPropagation(); setPanelIsOpen(true); addData(row); }}></div>
        </>
    )
}

export default FillRow;