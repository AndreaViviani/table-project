function setIsEditableReducer (state = false, action) {
    const value = action.value;
    switch(action.type) {
        case "EDIT":
            return state = value;
        default :
            return state;
    }
}

export default setIsEditableReducer;