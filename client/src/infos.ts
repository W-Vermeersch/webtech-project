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

const serverRouting = "http://localhost:5000";
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

function RouteToServer(path: string) {
  return serverRouting + path;
}
export default RouteToServer;
