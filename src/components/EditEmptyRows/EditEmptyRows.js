import React from "react";
import { useSelector, useDispatch } from "react-redux";
import FillRow from "../FillRow/FillRow";
import { updateRow, loadTable, setIsEditable } from "../../reduxStateManager/actions/index";
import removeCircularReference from "../../logicModules/removeCircularReference/removeCircularReference";

function EditEmptyRows(props) {

    const { isTableLoading, onTableLoadingChange } = props;

    const loadedTable = useSelector(state => state.loadedTable);
    const loadedKeys = useSelector(state => state.loadedKeys);
    const isEditable = useSelector(state => state.isEditable);

    const dispatch = useDispatch();

    const dispatchUpdate = (indexToUpdate, row) => {
        dispatch(updateRow(indexToUpdate, row));
    }
    const dispatchLoad = (data) => {
        dispatch(loadTable(data));
    }

    const dispatchEditable = (value) => {
        dispatch(setIsEditable(value));
    }

    React.useEffect(() => {
        if (isEditable) {
            const cells = []
            for (const col of loadedKeys) {
                cells.push(col.accessor);
            }
            for (let i = 0; i < loadedTable.length; i++) {
                let newRow = {};
                Object.assign(newRow, loadedTable[i]);
                for (const cell of cells) {
                    if (!loadedTable[i][cell]) {
                        newRow[cell] = <FillRow rowIndex={i} row={newRow} isTableLoading={isTableLoading} onTableLoadingChange={(isTableLoading) => { onTableLoadingChange(isTableLoading) }}></FillRow>;
                    }
                }
                dispatchUpdate(i, newRow);
            }
        } else {
            const tableToLoad = removeCircularReference(loadedTable, loadedKeys);
            dispatchLoad(tableToLoad);
        }
    }, [isEditable])

    return (
        <>
            {
                isEditable &&
                <button className={"secondaryButton"} onClick={(e) => {
                    e.preventDefault(); dispatchEditable(false)
                }}>
                    Confirm editing
            </button>
            }
            {
                !isEditable &&
                <button onClick={(e) => { e.preventDefault(); dispatchEditable(true) }}>
                    Edit Empty Rows
        </button>
            }

        </>
    )
}

export default EditEmptyRows;