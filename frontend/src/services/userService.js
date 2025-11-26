import axios from 'axios';

const API_URL = 'http://localhost:5001/api/users';

export async function signup(userData) {
  try {
    const response = await axios.post(
      `${API_URL}/signup`,
      userData
    );

    console.log("userService.js - Signup response: ", response);

    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {

    console.log("userService.js - Signup Failed: ", error);

    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Signup failed",
    };
  }
}

export async function login(userData) {
  try {
    const response = await axios.post(
      `${API_URL}/login`,
      userData,
      {
        withCredentials: true,
      }
    );

    console.log("userService.js - Login response: ", response);

    return {
      success: true,
      status: response.status,
      data: response.data,
    };
  } catch (error) {

    if (error.response) {
      console.log("userService.js - Login failed: ", error.response.data);
    } else {
      console.log("userService.js - Login error: ", error);
    }

    return {
      success: false,
      status: error.response?.status || 500,
      message: error.response?.data?.message || "Login failed",
    };
  }
}

export async function getCurrentUser() {
  try {
    const response = await axios.get(`${API_URL}/auth/me`, {
      withCredentials: true,
    });

    console.log("userService.js - getCurrentUser response: ", response);

    return { authenticated: true, user: response.data };
  } catch (error) {
    console.log("userService.js - getCurrentUser failed: ", error);
    return { authenticated: false, user: null };
  }
}