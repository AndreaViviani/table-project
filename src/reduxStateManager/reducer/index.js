import {combineReducers} from "redux";
import loadedTableReducer from "./LoadedTable";
import loadKeysReducer from "./LoadKeys";
import selectColReducer from "./SelectCol";
import loadNameReducer from "./LoadName";
import hasExtendedReducer from "./HasExtended";


const allReducers = combineReducers({
    loadedTable : loadedTableReducer,
    loadedKeys : loadKeysReducer,
    selectedCol : selectColReducer,
    loadedName : loadNameReducer,
    hasExtended : hasExtendedReducer,
})

export default allReducers;