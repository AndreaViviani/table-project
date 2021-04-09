import {combineReducers} from "redux";
import loadedTableReducer from "./LoadedTable";
import loadKeysReducer from "./LoadKeys";
import selectColReducer from "./SelectCol";
import loadNameReducer from "./LoadName";
import hasExtendedReducer from "./HasExtended";
import setIsEditableReduces from "./IsEditable";


const allReducers = combineReducers({
    loadedTable : loadedTableReducer,
    loadedKeys : loadKeysReducer,
    selectedCol : selectColReducer,
    loadedName : loadNameReducer,
    hasExtended : hasExtendedReducer,
    isEditable : setIsEditableReduces,
})

export default allReducers;