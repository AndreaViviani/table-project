const selectColReducer = ( state = [], action ) => {
    const colToSelect = action.colToSelect;
    const colToDeselect = action.colToDeselect;
    const colToPop = action.colToPop;
    switch(action.type) {
        case "DESELECT":
            return state = [...state.filter((item, index)=> item !== colToDeselect)]
        case "SELECT":
            return state = [colToSelect, ...state];
        case "POPSEL":
            const previousState = state;
            const nextState  = previousState.filter((el) => el !== colToPop);
        return state  = nextState;
        default:
            return state;
    }

}

export default selectColReducer;