import React from 'react';
import { useSelector } from 'react-redux';
import PlantCard from '../../components/PlantCard/PlantCard';

const MyGarden = () => {
    const plants = useSelector((state) => state.garden);
    const plantsArray = Array.from(plants.values());

    return (
        <>
            <h1>MyGarden</h1>
            <div>
                {
                    plantsArray.map((plant) => (
                        <PlantCard plant={plant} key={plant['id']}/>
                    ))
                }
            </div>
        </>
    );
};

export default MyGarden;