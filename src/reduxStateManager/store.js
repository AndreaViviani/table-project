import { createStore } from "redux";
import allReducers from "./reducer";

/*Qua ho fatto un po di copia ed incolla, in pratica viene salvato uno stato persistente 
che si conserva al refresh */

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
        const serializedState = JSON.stringify(state);
        localStorage.setItem('state', serializedState);
    } catch {
        // ignore write errors
    }
};




store.subscribe(saveState);


export default store;
