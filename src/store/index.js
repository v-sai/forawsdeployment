import { createStore } from "redux";

const count = 0;

const reducerFunction = (state = {count},action) => {
    if(action.type === "INC"){
        return {count : state.count+1};
    }
    if(action.type === "INCBY10"){
        return {count : state.count+10};
    }
    return state;
};

const store = createStore( reducerFunction );

export default store;
