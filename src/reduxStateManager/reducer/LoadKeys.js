const loadKeysReducer = ( state = null, action ) => {

    var keysToLoad = action.keysToLoad;
    var keyToAdd = action.keyToAdd;
    var indexToRemove = action.indexToRemove;
    var indexToAdd = action.indexToAdd;
    switch(action.type) {
        case "LOADKEYS":
            return state = keysToLoad;
        case "REMOVE":
            return state = [...state.filter((item, index)=> index !== indexToRemove)]
        case "ADD":
            var firstPortion = state.slice(0, indexToAdd);
            var secondPortion = state.slice(indexToAdd, state.length);
            var firstAddedPortion = [...firstPortion, keyToAdd];
            return state = firstAddedPortion.concat(secondPortion);

        default:
            return state;
    }

}

export default loadKeysReducer;