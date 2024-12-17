import axios from "axios";

const backendPort = 5000; // Change this to your backend's port
// const backendURL = `${window.location.protocol}//${window.location.hostname}:${backendPort}`;
const backendURL = `http://${window.location.hostname}:${backendPort}`;

export default axios.create({
    baseURL: backendURL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

export const axiosPrivate = axios.create({
    baseURL: backendURL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});
