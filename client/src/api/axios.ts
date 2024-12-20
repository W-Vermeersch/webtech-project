import axios from "axios";

const backendPort = 5000; // Change this to your backend's port
const backendURL = `${window.location.protocol}//${window.location.hostname}:${backendPort}`;
// const backendURL = `http://${window.location.hostname}:${backendPort}`;


// standard axios instance for public requests (with credentials)
export default axios.create({
    baseURL: backendURL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

// axios instance for private requests (with credentials) (not to be used raw!, see useAxiosPrivate)
export const axiosPrivate = axios.create({
    baseURL: backendURL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});
