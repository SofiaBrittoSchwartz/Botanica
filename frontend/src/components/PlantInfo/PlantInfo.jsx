import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const PlantInfo = () => {
  const [plant, setPlant] = useState({});
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const plant = location.state["plant"] || {};
    setPlant(plant);
  }, [location])

  return (
    <>
        <div>PlantInfo</div>
        <h1> {plant['common_name']} </h1>
        <button onClick={() => dispatch({type: 'addToGarden', payload: {item: plant}})}>Add to My Garden</button>
    </>
  )
}

export default PlantInfo;