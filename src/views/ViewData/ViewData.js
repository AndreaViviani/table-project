
import MyTable from "../../components/TableModule/MyTable/MyTable";
import React from "react";
import Commands from "../../components/CommandsModule/CommandsContainer/CommandsContainer";
import VizOptions from "../../components/TableModule/VizOptions/VizOptions";
import { useSelector } from "react-redux";
import style from "./ViewData.module.css";
import Loader from "react-loader-spinner";




function ViewData() {

    /*recupero anche lo stato attuale delle keys*/
    const loadedKeys = useSelector(state => state.loadedKeys);


    //stato che detrermina lo stato di caricamento d3ella tabella
    const [isTableLoading, setIsTableLoading] = React.useState(false);

    return (
        <>
            {/*Component for managing global states and data*/}
            <VizOptions>

            </VizOptions>
            {/*here go all commands Component*/}
            <Commands isTableLoading={isTableLoading} onTableLoadingChange={(isTableLoading)=>{setIsTableLoading(isTableLoading)}}>

            </Commands>
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