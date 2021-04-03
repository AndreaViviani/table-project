import {combineReducers} from "redux";
import loadedTableReducer from "./LoadedTable";
import loadKeysReducer from "./LoadKeys";
import selectColReducer from "./SelectCol";
import loadNameReducer from "./LoadName";


const allReducers = combineReducers({
    loadedTable : loadedTableReducer,
    loadedKeys : loadKeysReducer,
    selectedCol : selectColReducer,
    loadedName : loadNameReducer,
})

export default allReducers;