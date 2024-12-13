import {v2 as cloudinary} from "cloudinary";
const axios = require('axios');
require('dotenv').config();

export class CloudinaryApi {
    private debugging = false;
    private cloudinary_config = cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
    });

    public async postImage(url: string) {
        // return "https://res.cloudinary.com/dtd6mrszo/image/upload/v1733591932/kztj6vw6yavvz3u6cmrd.jpg";
        return "https://res.cloudinary.com/dtd6mrszo/image/upload/v1734000010/ovhwrjxrcjdakh8zysqg.jpg"
        try {
            const response = await cloudinary.uploader.upload(url, {
                resource_type: "image",
                transformation: [
                    {width: 1000, crop: "scale"},
                    {quality: "auto"},
                    {fetch_format: "auto"}
                ]
            }).then((url) => {
                return url
            })
            if (!response) {
                console.log(response)
                throw new Error(response.statusText);
            } else {
                console.log(response);
                return response.url;
            }
        } catch (error) {
            throw error;
        }
    }

    private async scanImage(imageUrl: string, prompt: string[]): Promise<any[]> {
        const url = `https://${this.cloudinary_config.api_key}:${this.cloudinary_config.api_secret}@api.cloudinary.com/v2/analysis/${this.cloudinary_config.cloud_name}/analyze/ai_vision_general`;

        const payload = {
            source: {
                uri: imageUrl
            },
            prompts: prompt
        };
        return axios
            .post(url, payload)
            .then((response: { data: { data: { analysis: { responses: { value: any; }[]; }; }; }; }) => {
                const tag: string[] = response.data.data.analysis.responses.map((val: { value: any; }) => {
                    return val.value
                })
                if (this.debugging)
                    console.log('Response:', tag);
                if (tag === undefined || tag[0].split('.')[0] == "None") {
                    return []
                }
                else return tag;
            })
            .catch((error: { response: { data: any; }; message: any; }) => {
                if (this.debugging)
                    console.error('Error:', error.response ? error.response.data : error.message);
                return [];
            });
    }

    public async identifyImage(imageUrl: string): Promise<string[]> {
        return new Promise(async (resolve, reject) => {return []})
        const prompts = [
            "Tell me in one word what animal is in this picture, if there is none say 'None'.",
            "If there is any animal, can you specify the specific animal race in one word."
        ]
        return this.scanImage(imageUrl, prompts);
    }

    public async appraiseImage(imageUrl: string): Promise<number[]> {
        return new Promise(async (resolve, reject) => {return [50, 1.0]})
        const prompts = [
            "Rate this image based on the scenery and the animal by only outputting a number on a scala of 1 to 100, if no animal give '0'.",
            "Rate the rarity rarity of the animal in the picture by only outputting a number with a scala of 1.0 to 5.0, if no animal give '0'."
        ]
        return this.scanImage(imageUrl, prompts).then((res: string[]) => {
            if (res.length === 2) {
                return [+res[0] ,+res[1]]
            } else return [0,0]
        });
    }
}