import MergeTable from "../MergeTable/MergeTable";
import ShowHide from "../ShowHide/ShowHide";
import style from "./Commands.module.css";
import { useSelector } from "react-redux";
import React from "react";

function Commands (props) {

    const { isTableLoading, onTableLoadingChange } = props;


    // recupero anche le colonne selezionate:
    const selectedCol = useSelector(state => state.selectedCol);




    return(
        <div className={style.toVisualDiv}>
                <h3 className={style.commandsLabel}>
                    Commands:
                </h3>
                <div>
                    {selectedCol.length > 0 &&

                        <MergeTable isTableLoading={isTableLoading} onTableLoadingChange={(isTableLoading) => { onTableLoadingChange(isTableLoading) }} //linfting up state here
                            className={style.commandsButton}>

                        </MergeTable>
                    }
                    <ShowHide className={style.commandsButton}>

                    </ShowHide>
                </div>
            </div>
    )
}

export default Commands;