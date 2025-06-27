import { firestore } from "@/config/firebase";
import { uploadFileToCloudinary } from "@/services/imageService";
import { ResponseType, WalletType } from "@/types";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";

export const createOrUpdateWallet = async (
  walletData: Partial<WalletType>
): Promise<ResponseType> => {
  try {
    let walletToSave = { ...walletData };

    if (walletData.image) {
      const imageUploadResponse = await uploadFileToCloudinary(
        walletData.image,
        "wallets"
      );
      if (!imageUploadResponse.success) {
        return {
          success: false,
          message:
            imageUploadResponse.message || "Failed to Upload wallet Icon",
        };
      }
      walletToSave.image = imageUploadResponse.data;
    }
    if (!walletData?.id) {
      // new wallet
      walletToSave.amount = 0;
      walletToSave.totalIncome = 0;
      walletToSave.totalExpenses = 0;
      walletToSave.created = new Date();
    }
    const walletRef = walletData?.id
      ? doc(firestore, "wallets", walletData?.id)
      : doc(collection(firestore, "wallets"));

      await setDoc(walletRef, walletToSave, {merge: true});
      return {success: true, data: {...walletToSave, id: walletRef.id}}
  } catch (error: any) {
    console.log("error creating or updating wallet", error);
    return { success: false, message: error.message };
  }
};


export const deleteWallet = async (walletId: string): Promise<ResponseType> => {
  try {
    const walletRef = doc(firestore, 'wallets', walletId);
    await deleteDoc(walletRef);

    // todo: delete all transactions related to this wallet

    return {success: true, message: 'Wallet Deleted Successfully'}
    
  } catch (error: any) {
    console.log("error deleting the wallet", error);
    return {success: false, message: error.message}

    
  }
}
