import { firestore } from "@/config/firebase";
import { uploadFileToCloudinary } from "@/services/imageService";
import { ResponseType, TransactionType, WalletType } from "@/types";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    const { id, type, walletId, amount, image } = transactionData;
    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, message: "invalid transaction data" };
    }

    if (id) {
      // todo: update existing transaction
    } else {
      // update wallet for new transaction
      let response = await updateWalletForNewTransaction(
        walletId!,
        Number(amount!),
        type
      );
      if (response && !response.success) return response;
    }
    if (image) {
      const imageUploadResponse = await uploadFileToCloudinary(
        image,
        "transactions"
      );
      if (!imageUploadResponse.success) {
        return {
          success: false,
          message: imageUploadResponse.message || "Failed to Upload image",
        };
      }
      transactionData.image = imageUploadResponse.data;
    }
    const transactionRef = id
      ? doc(firestore, "transactions", id)
      : doc(collection(firestore, "transactions"));

    await setDoc(transactionRef, transactionData, { merge: true });
    return { success: true, data: {...transactionData, id: transactionRef.id} };

  } catch (error: any) {
    console.log("error creating or updating transaction", error);
    return { success: false, message: error.message };
  }
};

const updateWalletForNewTransaction = async (
  waleltId: string,
  amount: number,
  type: string
) => {
  try {
    const walletRef = doc(firestore, "wallets", waleltId);
    const walletSnapshot = await getDoc(walletRef);
    if (!walletSnapshot.exists) {
      console.log("error updating wallet for new transaction");
      return { success: false, message: "Unexpected Error. Wallet not found!" };
    }
    const walletData = walletSnapshot.data() as WalletType;

    if (type === "expense" && walletData.amount! - amount < 0) {
      return {
        success: false,
        message: "Insufficient funds in wallet for this transaction",
      };
    }
    const updateType = type === "income" ? "totalIncome" : "totalExpenses";
    const updatedWalletAmount =
      type === "income"
        ? Number(walletData.amount) + amount
        : Number(walletData.amount) - amount;

    const updatedTotals =
      type === "income"
        ? Number(walletData.totalIncome) + amount
        : Number(walletData.totalExpenses) + amount;

    await updateDoc(walletRef, {
      amount: updatedWalletAmount,
      [updateType]: updatedTotals,
    });
  } catch (error: any) {
    console.log("error updating wallet for new transaction", error);
    return { success: false, message: error.message };
  }
};
