const backendPort = 5000; // Change this to your backend's port
const backendURL = `${window.location.protocol}//${window.location.hostname}:${backendPort}`;

function RouteToServer(path: string){
    return backendURL + path;
}
export default RouteToServer;