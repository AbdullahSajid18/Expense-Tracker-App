import { firestore } from "@/config/firebase";
import { ResponseType, UserDataType } from "@/types";
import { doc, updateDoc } from "firebase/firestore";



export const updateUser = async (uid: string, updatedData: UserDataType): Promise<ResponseType> => {
    try {
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