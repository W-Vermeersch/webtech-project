import {v2 as cloudinary} from "cloudinary";
import path = require("path");

export class CloudinaryApi {
    cloudinary = cloudinary.config({
        cloud_name: 'dtd6mrszo',
        api_key: '772896582425995',
        api_secret: 'cJERdPRUsBChIrjvUlmR9nbw_MM'
});
    public async postImage(url: string){
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
        if (!response){
            console.log(response)
            throw new Error(response.statusText);
        } else {
            console.log(response);
            return response.url;
        }
    }
}
//
// const cloudinaryApi = new CloudinaryApi();
//
// const pathway = path.join(__dirname, "uploads/chat.jpg");
// cloudinaryApi.postImage(pathway).then((url)=> {
//     console.log(url);
// });