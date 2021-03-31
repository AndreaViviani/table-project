import ModOptions from "../../components/ModOptions/ModOptions";
import MyTable from "../../components/MyTable/MyTable";
import React from "react";
import VizOptions from "../../components/VizOptions/VizOptions";
import MergeTable from "../../components/MergeTable/MergeTable";
import ShowHide from "../../components/ShowHide/ShowHide";
import { useSelector } from "react-redux";
import style from "./ViewData.module.css";
import Loader from "react-loader-spinner";




function ViewData() {

    /*recupero anche lo stato attuale delle keys*/
    const loadedKeys = useSelector(state => state.loadedKeys);

    // recupero anche le colonne selezionate:
    const selectedCol = useSelector(state => state.selectedCol);

    //stato che detrermina lo stato di caricamento d3ella tabella
    const [isTableLoading, setIsTableLoading] = React.useState(false);

    return (
        <>
            {/*Component for managing global states and data*/}
            <VizOptions>

            </VizOptions>
            {/*Component saving table*/}
            <ModOptions>

            </ModOptions>
            {/*here go all commands Component*/}
            <div className={style.toVisualDiv}>
                <h3 className={style.commandsLabel}>
                    Commands:
                </h3>
                <div>
                    {selectedCol.length > 0 &&

                        <MergeTable isTableLoading={isTableLoading} onTableLoadingChange={(isTableLoading) => { setIsTableLoading(isTableLoading) }} //linfting up state here
                            className={style.commandsButton}>

                        </MergeTable>
                    }
                    <ShowHide className={style.commandsButton}>

                    </ShowHide>
                </div>
            </div>


            {
                loadedKeys && !isTableLoading &&
                <MyTable>

                </MyTable>
            }
            {
                isTableLoading &&
                <div className={style.toVisualDiv}>
                    <Loader
                        type="Puff"
                        color="#00BFFF"
                        height={300}
                        width={300}
                    />
                </div>

            }


        </>
    )
}

export default ViewData;