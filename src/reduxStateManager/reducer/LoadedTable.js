const loadedTableReducer = (state = [], action)=>{
    var dataToLoad = action.dataToLoad;
    switch(action.type){
        case "LOAD":
            return state = dataToLoad;
        default:
            return state;
    }
};

export default  loadedTableReducer;
