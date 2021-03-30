import style from "./ModOptions.module.css";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import React from "react";

//This component will have function to merge table, reset table with the original and save on the server
function ModOptions() {

    const loadedTable = useSelector(state => state.loadedTable);

    const [toSaveName, setToSaveName] = React.useState("");


    //Facciamo una funzione per salvare la tabella, dovrà inviare una post (con axios) al server */
    function handleSave() {
        console.log('ciao');
        axios.post(`http://localhost:3001/save/${toSaveName}`, {
            data: loadedTable,
        })
        .then((res) => {
            if (res.data.nameIsTaken) {
                alert("This name has already been taken, choose a different name");
            }
             else if(!res.data.nameIsTaken && res.data.success) {
                alert(`${toSaveName} table saved successfully`)
            } else {
                alert("An error occured in saving table, try again later")
            }
        })
        
    }

    function handleChange(e){
        setToSaveName(e.target.value);
    }



    return (
        <>
            <div className={style.modTableDiv}>
                <div className={style.resetSave}>
                    <label>Con quale nome vuoi salvare la tua tabella? </label>
                    <input type="text" onChange={(e)=>{handleChange(e)}}/>
                    <div className={style.saveButton} onClick={() => {handleSave()}}>
                        Save table
                    </div>
                </div>

            </div>
        </>
    )
}

export default ModOptions;