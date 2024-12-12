import * as exifr from "exifr";

interface GeoData {
    longitude: number|null;
    latitude: number|null;
}

function getRandomLatLonInEurope() {
    // Define the bounding box for Europe
    const minLat = 35.0;  // Southernmost point (e.g., Greece)
    const maxLat = 71.0;  // Northernmost point (e.g., Norway)
    const minLon = -10.0; // Westernmost point (e.g., Portugal)
    const maxLon = 40.0;  // Easternmost point (e.g., Russia)

    // Generate random latitude and longitude within the bounding box
    const latitude = Math.random() * (maxLat - minLat) + minLat;
    const longitude = Math.random() * (maxLon - minLon) + minLon;

    return { latitude, longitude };
}

function getRandomLatLonInBelgium() {
    // Define the bounding box for Belgium
    const minLat = 49.5;  // Southernmost point of Belgium
    const maxLat = 51.5;  // Northernmost point of Belgium
    const minLon = 2.5;   // Westernmost point of Belgium
    const maxLon = 6.5;   // Easternmost point of Belgium

    // Generate random latitude and longitude within the bounding box
    const latitude = Math.random() * (maxLat - minLat) + minLat;
    const longitude = Math.random() * (maxLon - minLon) + minLon;

    return { latitude, longitude };
}

export async function GPSDataExtractor(tmpFile: string) {

    let output: GeoData = await exifr.parse(tmpFile)

    if (output == undefined || !output || !output.latitude || !output.longitude){
        const randomGeoData: GeoData = getRandomLatLonInBelgium();
        return randomGeoData;
    }
    else {
        return output;
    }
}