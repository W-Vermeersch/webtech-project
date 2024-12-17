import {v2 as cloudinary} from "cloudinary";
const axios = require('axios');
require('dotenv').config();

interface imageAppraise{
    tags: string[];
    rating: {
        score: number,
        rarity: number
    };
}

export class CloudinaryApi {
    private debugging = true;
    private cloudinary_config = cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_SECRET,
    });

    public async postImage(url: string) {
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
                // console.log(response)
                throw new Error(response.statusText);
            } else {
                // console.log(response);
                return response.secure_url;
            }
        } catch (error) {
            throw error;
        }
    }

    public async processImage(url: string): Promise<imageAppraise> {
        const prompts = [
            "Tell me in one word what animal is in this picture, if there is none say 'None'.",
            "If there is any animal, can you specify the specific animal race in one word.",
            "Rate this image based on the scenery and the animal by only outputting a number on a scala of 1 to 100, if no animal give '0'.",
            "Rate the rarity rarity of the animal in the picture by only outputting a number with a scala of 1.0 to 5.0, if no animal give '0'."
        ]

        return this.scanImage(url, prompts).then((res: string[]): imageAppraise => {
            if (res.length === 4) {
                return {
                    tags: [res[0].toString(), res[1].toString()],
                    rating: {
                        score: +res[2],
                        rarity: +res[3]
                    }
                }
            } else return undefined
        }).catch((error) => {
            console.log(error);
            return undefined
        });
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
            .then((response) => {
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
            .catch((error) => {
                if (this.debugging)
                    console.error('Error:', error);
                return [];
            });
    }

    public async identifyImage(imageUrl: string): Promise<string[]> {
        const prompts = [
            "Say in two words what animal you find in this picture, say 'None' if there is no animal.",
        ]
        return this.scanImage(imageUrl, prompts).then((res: string[]) => {
            return res.map((val) => val.split(' ')).flat()
        });
    }

    public async appraiseImage(imageUrl: string): Promise<{score: number, rarity: number}> {
        const prompts = [
            "Rate with only a number on a scala of 1 to 100, the score of this image.",
            "Rate with only a number on a scala of 1.0 to 5.0, the rarity of the animal."
        ]
        return this.scanImage(imageUrl, prompts).then((res: string[]) => {
            if (res.length === 2) {
                return {
                    score: +res[0],
                    rarity: +res[1]
                }
            } else return {
                score: 0,
                rarity: 1.0
            }
        });
    }
}