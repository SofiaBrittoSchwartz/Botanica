import React from 'react'
import axios from 'axios'

const UseFetch = (url) => {
    
    const fetchData = async (url) => {
        try {
            const response = await axios.get(url);
            
            if(response.status === 201) {
                return response.data;
            } else if (response.status === 404) {
                throw error();
            }
        } catch (e) {
            console.log("An error occurred: ", e.message);
        }
    }

    return (
    <></>
    )
}

export default UseFetch;