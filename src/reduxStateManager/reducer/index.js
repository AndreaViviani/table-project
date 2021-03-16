import {combineReducers} from "redux";
import loadedTableReducer from "./LoadedTable";
import loadKeysReducer from "./LoadKeys";
import selectColReducer from "./SelectCol";


const allReducers = combineReducers({
    loadedTable : loadedTableReducer,
    loadedKeys : loadKeysReducer,
    selectedCol : selectColReducer,
})

export default allReducers;