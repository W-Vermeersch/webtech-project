import {v2 as cloudinary} from "cloudinary";

export class CloudinaryApi {
    cloudinary = cloudinary.config({
        cloud_name: 'dtd6mrszo',
        api_key: '772896582425995',
        api_secret: 'cJERdPRUsBChIrjvUlmR9nbw_MM'
});
    public async postImage(url: string){
        const response = await cloudinary.uploader.upload(url).then((url) => {
            return url
        })
        if (response.status !== 200){
            throw new Error(response.statusText);
        } else {
            return response.url;
        }
    }
}