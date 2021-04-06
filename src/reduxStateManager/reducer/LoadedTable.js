
const loadedTableReducer = (state = [], action)=>{
    const dataToLoad = action.dataToLoad;
    const colToPop = action.colToPop;
    switch(action.type){
        case "LOAD":
            console.log("loado");
            return state = dataToLoad;
        case "POP":
            const myNewState = state;
            for ( const obj of myNewState) {
                delete obj[colToPop];
            }
            return state = myNewState;
        default:
            return state;
    }
};

export default  loadedTableReducer;
