import MergeTable from "../MergeTable/MergeTable";
import ShowHide from "../ShowHide/ShowHide";
import style from "./Commands.module.css";
import { useSelector } from "react-redux";
import React from "react";
import SaveTable from "../SaveTable/SaveTable";
import EditEmptyRows from "../EditEmptyRows/EditEmptyRows";

function Commands (props) {

    //props passate dalla view viewdata, che passo a loro volta alla tabella
    const { isTableLoading, onTableLoadingChange } = props;


    // recupero anche le colonne selezionate x decidere se mostrare il comando merge
    const selectedCol = useSelector(state => state.selectedCol);
    const loadedName = useSelector(state => state.loadedName);
    const loadedTable = useSelector(state => state.loadedTable);

    return(
        <div className={style.toVisualDiv}>
                <h2 className={style.commandsLabel}>
                    {loadedName}
                </h2>
                <div>
                    {selectedCol.length > 0 &&

                        <MergeTable isTableLoading={isTableLoading} onTableLoadingChange={(isTableLoading) => { onTableLoadingChange(isTableLoading) }} //linfting up state here
                            className={style.commandsButton}>

                        </MergeTable>
                    }
                    <ShowHide className={style.commandsButton}>

                    </ShowHide>
                    <EditEmptyRows isTableLoading={isTableLoading} onTableLoadingChange={(isTableLoading) => { onTableLoadingChange(isTableLoading) }} >

                    </EditEmptyRows>
                    <SaveTable>
                        
                    </SaveTable>
                </div>
            </div>
    )
}

export default Commands;