import { createStore } from "redux";
import allReducers from "./reducer";
import removeCircularReference from "../logicModules/removeCircularReference/removeCircularReference";
import {useDispatch} from "react-redux";

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        return JSON.parse(serializedState);
    } catch (err) {
        return undefined;
    }
};



const persistedState = loadState();

const store = createStore(allReducers,
    persistedState,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());


 const saveState = () => {
    const state = store.getState();
    try {
        // qua dobbiamo caricare lo stato "pulito" senza i riferimenti a se stesso del componente fillrow 
        //const stateToSerialize = state;
        //stateToSerialize.loadedTable = removeCircularReference(state.loadedTable, state.loadedKeys);
        // adesso posso caricare lo stato serializzato, per recuperarlo onPageReload
        //const serializedState = JSON.stringify(stateToSerialize);
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);

    } catch(error) {
        /*console.log(error);
        //qua dobbiamo caricare lo stato "pulito" senza i riferimenti a se stesso del componente fillrow 
        const stateToSerialize = state;
        stateToSerialize.loadedTable = removeCircularReference(state.loadedTable, state.loadedKeys);
        //adesso posso caricare lo stato serializzato, per recuperarlo onPageReload
        const serializedState = JSON.stringify(stateToSerialize);
        localStorage.setItem('state', serializedState);*/
    }
};




store.subscribe(saveState);


export default store;

