const loadNameReducer = (state = null, action) => {
    const nameToSave = action.nameToSave;
    switch(action.type) {
        case"LOADNAME":
            return state = nameToSave;
        default:
            return state = state;
    }
}

export default loadNameReducer;