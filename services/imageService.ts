import { CLOUDINARY_CLOUD_NAME } from "@/constants";
import { ResponseType } from "@/types";

const CLOUDINARY_CLOUD_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`

export const uploadFileToCloudinary = async (
    file: {uri?: string} | string,
    folderName: string

): Promise<ResponseType> => {
    try {
        return {success: true}
    } catch (error: any) {
        console.log("Got Error Uploading File ", error);
        return {success: false, message: error.message || 'Could Not Upload file'}
        
    }
}

export const getProfileImage = (file: any) => {
    if(file && typeof file == 'string') return file;
    if(file && typeof file == 'object') return file.uri;

    return require('@/assets/images/defaultAvatar.png');

}