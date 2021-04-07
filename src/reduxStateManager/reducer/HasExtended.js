function hasExtendedReducer (state = false, action) {
    const value = action.value;
    switch(action.type) {
        case "EXTEND":
            return state = value;
        default: 
            return state;
    }
}

export default  hasExtendedReducer;