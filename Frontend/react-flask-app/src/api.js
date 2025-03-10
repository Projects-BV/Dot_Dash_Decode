import axios from "axios";

//flask backend URL
const API_URL="https://127.0.0.1:5000/auth";

export const registerUser=async(userData)=>{
    return axios.post(`${API_URL}/register`,userData);
};

export const loginUser=async(userData)=>{
    return axios.post(`${API_URL}/login`,userData);
};

export const getProfile=async(token)=>{
    return axios.get(`${API_URL}/profile`,{
        headers:{Authorization:`Bearer ${token}`},
    });
};