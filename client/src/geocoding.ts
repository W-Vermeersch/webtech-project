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

export async function getCityCountry(
  latitude: number,
  longitude: number
): Promise<{ state: string; country: string }> {
  try {
    const { results } = await geocode(
      RequestType.LATLNG,
      `${latitude},${longitude}`
    );

    interface AddressComponent {
      long_name: string;
      short_name: string;
      types: string[];
    }

    const { state, country } = results[0].address_components.reduce(
      (
        acc: { state: string; country: string },
        component: AddressComponent
      ) => {
        if (component.types.includes("locality")) {
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

export async function getLatLng(address: string): Promise<{ lat: number; lng: number }> {
  try {
    const { results } = await geocode(RequestType.ADDRESS, address);
    const { lat, lng } = results[0].geometry.location;
    console.log(lat, lng);
    return { lat: lat, lng: lng };
  } catch (error) {
    console.error(error);
    return {lat: NaN, lng: NaN};
  }
}

setKey(mapsAPIKey);
setLanguage("en");
