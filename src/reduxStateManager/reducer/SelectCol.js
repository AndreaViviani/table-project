const selectColReducer = ( state = [], action ) => {
    var colToSelect = action.colToSelect;
    var colToDeselect = action.colToDeselect;
    switch(action.type) {
        case "DESELECT":
            return state = [...state.filter((item, index)=> item !== colToDeselect)]
        case "SELECT":
            return state = [colToSelect, ...state];
        default:
            return state;
    }

}

export default selectColReducer;