import { createStore } from 'redux';

const gardenReducer = (state = {garden: new Map()}, action) => {
    if(action.type === 'addToGarden') {
        const item = action.payload['item'];
        const key = item['_id'] || item['id'];
        const newGarden = new Map(state.garden);

        if (newGarden.has(key)) {
            console.log(`${item['common_name']} is already in garden`);
        } else {
            console.log(`${item['common_name']} (id: ${key}) added to garden`);
            newGarden.set(key, item);
        }

        return { garden: newGarden };
    }

    if (action.type === 'removeFromGarden') {
        const item = action.payload['item'];
        const key = item['_id'] || item['id'];
        const newGarden = new Map(state.garden);
        newGarden.delete(key);
        return { garden: newGarden };
    }

    return state;
}

const store = createStore(gardenReducer);

export default store;