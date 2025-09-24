import axios from 'axios';

export async function signup(userData) {
    try {
        console.log(userData)
        const response = await axios.post('http://localhost:5001/api/users/signup', userData);
        console.info(response);
        return response;
      } catch (e) {
        console.log(e);
        return false;
      }
}