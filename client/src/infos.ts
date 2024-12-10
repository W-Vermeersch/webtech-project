import {
  setKey,
  setLanguage,
  setRegion,
  fromAddress,
  fromLatLng,
  fromPlaceId,
  setLocationType,
  geocode,
  RequestType,
} from "react-geocode";

export const mapsAPIKey = "AIzaSyAxcoTGl9eGJr427kNv1YwOObWbkXPE1no";

export async function getCityCountry(latitude: number, longitude: number): Promise<{ state: string; country: string }> {
  try {
    const { results } = await geocode(RequestType.LATLNG, `${latitude},${longitude}`);

    interface AddressComponent {
      long_name: string;
      short_name: string;
      types: string[];
    }

    const { state, country } = results[0].address_components.reduce(
      (acc: { state: string; country: string }, component: AddressComponent) => {
        if (component.types.includes("administrative_area_level_1")) {
          acc.state = component.long_name;
        } else if (component.types.includes("country")) {
          acc.country = component.long_name;
        }
        return acc;
      },
      { state: "", country: "" }
    );

    return { state, country };

  } catch (error) {
    console.error(error);
    return { state: "", country: "" };
  }
}

setKey(mapsAPIKey);
setLanguage("en");
const backendPort = 5000; // Change this to your backend's port
const backendURL = `${window.location.protocol}//${window.location.hostname}:${backendPort}`;

function RouteToServer(path: string){
    return backendURL + path;
}
export default RouteToServer;