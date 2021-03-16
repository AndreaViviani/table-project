const setRowsReducer = (state = 0, action) => {
    var rowsToSet = action.rowsToSet;
    switch(action.type) {
        case "SETROWS":
            return state = rowsToSet;
        default:
            return state;
    }
}
export default setRowsReducer;