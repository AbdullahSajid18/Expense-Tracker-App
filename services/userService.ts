import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";
import { uploadFileToCloudinary } from "@/services/imageService";



export const updateUser = async (uid: string, updatedData: UserDataType): Promise<ResponseType> => {
    try {
        if(updatedData.image && updatedData?.image?.uri) {
            const imageUploadResponse = await uploadFileToCloudinary(updatedData.image, 'users');
            if(!imageUploadResponse.success) {
                return {
                    success: false,
                    message: imageUploadResponse.message || 'Failed to Upload image'
                }
            }
            updatedData.image = imageUploadResponse.data;
        }
        const userRef = doc(firestore, 'users', uid);
        await updateDoc(userRef, updatedData);
        return {
            success: true,
            message: 'Updated successfully'
        }
    } catch (error) {
        console.log('Error in Updating the user', error);
        return {
            success: false,
            message: (error as Error)?.message
        }
    }
}