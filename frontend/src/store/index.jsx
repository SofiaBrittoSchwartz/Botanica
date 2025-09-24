import { createStore } from 'redux';

const gardenReducer = (state = {garden: new Map()}, action) => {
    if(action.type === 'addToGarden') {
        const item = action.payload['item'];
        const newGarden = new Map(state.garden);

        if (newGarden.has(item['id'])) {
            console.log(`${item['common_name']} is already in garden`);
        } else {
            console.log(`${item['common_name']} (id: ${item['id']}) added to garden`);
            newGarden.set(item['id'], item);
        }

        return { garden: newGarden };
    }

    return state;
}

const store = createStore(gardenReducer);

export default store;