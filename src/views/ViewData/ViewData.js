import ModOptions from "../../components/ModOptions/ModOptions";
import MyTable from "../../components/MyTable/MyTable";
import React from "react";
import VizOptions from "../../components/VizOptions/VizOptions";
import { useSelector } from "react-redux";




function ViewData() {

    const loadedKeys = useSelector(state => state.loadedKeys);

    return (
        <>
            <ModOptions>

            </ModOptions>
            <VizOptions>

            </VizOptions>
            {
                loadedKeys &&
                <MyTable>

                </MyTable>
            }


        </>
    )
}

export default ViewData;