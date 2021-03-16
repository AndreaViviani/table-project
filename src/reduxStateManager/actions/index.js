export const loadTable = (dataToLoad) =>{
    return{
        type: "LOAD",
        dataToLoad,
    };
};

export const loadKeys = (keysToLoad) => {
    console.log(keysToLoad);
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

export const addKeys = (keyToAdd, indexToAdd) => {
    return{
        type:"ADD",
        keyToAdd,
        indexToAdd,
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

