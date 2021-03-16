import style from "./ModOptions.module.css";
//import { useSelector, useDispatch } from "react-redux";
//import axios from "axios";

//This component will have function to merge table, reset table with the original and save on the server
function ModOptions() {

    /*Per resettare la tabella dobbiamo sovrarscivere la copied table con la loaded table */
    //const loadedTable = useSelector(state => state.loadedTable);
    //const dispatch = useDispatch();
    /*Questa è la funzione incaricata */


    /*che deve essere chiamata al click su reset */


    /*Facciamo una funzione per salvare la tabella, dovrà inviare una post (con axios) al server */
    /*function handleSave() {
        axios.post("http://localhost:3000/save", {
            title: "myTitle",
            data: actualTable
        })
        
    }*/



    return (
        <>
            <div className={style.modTableDiv}>
                <p>Here you can reset, save and merge another column on your table</p>
                <div className={style.resetSave}>
                    <div className={style.saveButton} /*onClick={handleSave()}*/>
                        Save table
                    </div>
                </div>

            </div>
        </>
    )
}

export default ModOptions;