const serverRouting = "http://192.168.1.20:5000";

function RouteToServer(path: string){
    return serverRouting + path;
}
export default RouteToServer;