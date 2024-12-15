import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';

const PlantInfo = () => {
  const [plant, setPlant] = useState({});
  const location = useLocation();

  useEffect(() => {
    const plant = location.state["plant"] || {};
    setPlant(plant);
    console.log(plant)
  }, [location])

  return (
    <>
        <div>PlantInfo</div>
        <h1> {plant['common_name']} </h1>
        <button>Add to Cart</button>
    </>
  )
}

export default PlantInfo