import React, {useEffect, useState} from 'react'
import PlantCard from '../PlantCard/PlantCard';
import mockData from '../../data/mockData.json'
import { useNavigate } from 'react-router-dom';
import './PlantList.css'

const PlantList = () => {
    const navigate = useNavigate();
    const [plantList, setPlantlist] = useState([]);

    useEffect(() => {
        loadPlants();
    }, []);

    function handleClick() {
        navigate('/plantinfo');
    }

    async function loadPlants() {
        if(process.env.NODE_ENV === 'development') {
            setPlantlist(mockData.data);
        } else {
            try {
                const response = await fetch('https://perenual.com/api/species-list?key=sk-ox9f675251bf61cd77902');
                if(response) {
                    const json = await response.json();
                    setPlantlist(json.data);
                } else {
                    throw new Error(response)
                }
            } catch (e) {
                console.log(e);
            }
        }
    }

    return (
        <div>
            <h2>Plant List</h2>
            <div className="plantList">
            {
                plantList.map((plant) => (
                    <PlantCard plant={plant} key={plant['id']} onChildClick={handleClick}/>
                ))
            }
            </div>
        </div>
    )
}

export default PlantList