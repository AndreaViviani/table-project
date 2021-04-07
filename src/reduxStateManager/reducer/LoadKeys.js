import produce from "immer";

const loadKeysReducer = ( state = null, action ) => {
    const colToHideId = action.colToHideId;
    const colToShowId = action.colToShowId;
    const keysToLoad = action.keysToLoad;
    const colToPop = action.colToPop;
    const previousState = state;
    switch(action.type) {
        case "LOADKEYS":
            console.log("carico");
            return state = keysToLoad;
        case "HIDE":
            let indexToHide = null;
            for(let i = 0; i < previousState.length; i ++) {
                if (previousState[i].id === colToHideId) {
                    indexToHide = i;
                }
            }
            const nextHiddenState = produce(previousState, draftState => {
                draftState[indexToHide].show = false;
            })
            return state = nextHiddenState;
        case "SHOW":
            let indexToShow = null;
            for(let i = 0; i < previousState.length; i ++) {
                if (previousState[i].id === colToShowId) {
                    indexToShow = i;
                }
            }
            const nextShownState = produce(previousState, draftState => {
                draftState[indexToShow].show = true;
            })
            return state = nextShownState;
        case "POPCOL":
            const nextState = [];
            for (const el of previousState){
                if (el.id === colToPop) {
                    continue;
                } else {
                    nextState.push(el);
                }
                console.log(nextState);
            }
            return state = nextState;
        default:
            return state;
    }

}

export default loadKeysReducer;