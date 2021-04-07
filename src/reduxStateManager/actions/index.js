export const loadTable = (dataToLoad) =>{
    console.log("im loading");
    return {
        type: "LOAD",
        dataToLoad,
    };
}
    

export const loadKeys = (keysToLoad) => {
    return{
        type:"LOADKEYS",
        keysToLoad,
    }
}

export const removeKeys = (indexToRemove) => {
    return{
        type:"REMOVE",
        indexToRemove,
    }
}

export const selectCol = (colToSelect) => {
    console.log(`seleziono colonna ${colToSelect}`)
    return{
        type:"SELECT",
        colToSelect,
    }
}
export const deselectCol = (colToDeselect) => {
    return{
        type:"DESELECT",
        colToDeselect,
    }
}

export const hideCol = (colToHideId) => {
    return {
        type: "HIDE",
        colToHideId,
    }
}

export const showCol = (colToShowId) => {
    return {
        type: "SHOW",
        colToShowId,
    }
}

export const popColData = (colToPop) => {
    return {
        type: "POP",
        colToPop,
    }
}

export const popCol = (colToPop) => {
    return {
        type:"POPCOL", 
        colToPop,
    }
}

export const popColSel = (colToPop) => {
    return {
        type:"POPSEL",
        colToPop,
    }
}

export const delSel = () => {
    return {
        type: "DELETESEL",
    }
}

export const loadName = (nameToSave) => {
    return {
        type: "LOADNAME",
        nameToSave,
    }
}

export const updateRow = (indexToUpdate, rowToUpdate) => {
    return {
        type: "UPDATEROW",
        indexToUpdate, 
        rowToUpdate,
    }
}

export const setHasBeenExtended = (value) =>{
    return {
        type:"EXTEND",
        value,
    }
}
