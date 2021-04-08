import produce from "immer";

const loadedTableReducer = (state = null, action)=>{
    const dataToLoad = action.dataToLoad;
    const colToPop = action.colToPop;
    const rowToUpdate = action.rowToUpdate;
    const indexToUpdate = action.indexToUpdate;
    const previousState = state;
    switch(action.type){
        case "LOAD":
            return state = dataToLoad;
        case "POP":
            const myNewState = state;
            for ( const obj of myNewState) {
                delete obj[colToPop];
            }
            return state = myNewState;
        case "UPDATEROW":
            const nextHiddenState = produce(previousState, draftState => {
                draftState[indexToUpdate] = rowToUpdate;
            })
            return state = nextHiddenState;
        default:
            return state;
    }
};

export default  loadedTableReducer;
