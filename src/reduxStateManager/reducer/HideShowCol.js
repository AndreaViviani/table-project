const loadKeysReducer = ( state = null, action ) => {

    var keysToLoad = action.keysToLoad;
    switch(action.type) {
        case "LOADKEYS":
            return state = keysToLoad;
        default:
            return state;
    }

}

export default loadKeysReducer;