const serverRouting = "http://localhost:5000";

function RouteToServer(path: string){
    return serverRouting + path;
}
export default RouteToServer;