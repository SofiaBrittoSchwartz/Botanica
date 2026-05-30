import { useDispatch, useSelector } from 'react-redux';

export function useGardenState(plant) {
    const dispatch = useDispatch();
    const plantKey = plant?._id || plant?.id;
    const inGarden = useSelector(state => plantKey ? state.garden.has(plantKey) : false);

    function addToGarden(e) {
        e?.stopPropagation();
        if (plantKey && !inGarden) dispatch({ type: 'addToGarden', payload: { item: plant } });
    }

    function removeFromGarden(e) {
        e?.stopPropagation();
        if (plantKey && inGarden) dispatch({ type: 'removeFromGarden', payload: { item: plant } });
    }

    return { inGarden, addToGarden, removeFromGarden };
}
