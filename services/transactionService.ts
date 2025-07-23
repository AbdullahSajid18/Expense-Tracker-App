import { firestore, auth } from "@/config/firebase";
import { uploadFileToCloudinary } from "@/services/imageService";
import { createOrUpdateWallet } from "@/services/walletService";
import { ResponseType, TransactionType, WalletType } from "@/types";
import { collection, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const createOrUpdateTransaction = async (
  transactionData: Partial<TransactionType>
): Promise<ResponseType> => {
  try {
    // Check if user is authenticated
    if (!auth.currentUser) {
      return { success: false, message: "User not authenticated" };
    }

    const { id, type, walletId, amount, image } = transactionData;
    if (!amount || amount <= 0 || !walletId || !type) {
      return { success: false, message: "invalid transaction data" };
    }

    if (id) {
      const oldTransactionSnapshot = await getDoc(
        doc(firestore, "transactions", id)
      );
      
      if (!oldTransactionSnapshot.exists()) {
        return { success: false, message: "Transaction not found" };
      }
      
      const oldTransaction = oldTransactionSnapshot.data() as TransactionType;
      const shouldRevertOriginal =
        oldTransaction.type !== type ||
        oldTransaction.amount !== amount ||
        oldTransaction.walletId !== walletId;

      if (shouldRevertOriginal) {
        let response = await revertAndUpdateWallets(
          oldTransaction,
          Number(amount),
          type,
          walletId!
        );
        if (response && !response.success) return response;
      }
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

    // Add user ID to transaction data for security
    const finalTransactionData = {
      ...transactionData,
      userId: auth.currentUser.uid,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await setDoc(transactionRef, finalTransactionData, { merge: true });
    return {
      success: true,
      data: { ...finalTransactionData, id: transactionRef.id },
    };
  } catch (error: any) {
    console.log("error creating or updating transaction", error);
    
    // Handle specific Firebase permission errors
    if (error.code === 'permission-denied') {
      return { success: false, message: "Permission denied. Please check your authentication and security rules." };
    }
    
    return { success: false, message: error.message };
  }
};

const updateWalletForNewTransaction = async (
  walletId: string,
  amount: number,
  type: string
) => {
  try {
    // Check authentication
    if (!auth.currentUser) {
      return { success: false, message: "User not authenticated" };
    }

    const walletRef = doc(firestore, "wallets", walletId);
    const walletSnapshot = await getDoc(walletRef);
    
    if (!walletSnapshot.exists()) {
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
      updatedAt: new Date()
    });

    return { success: true };
  } catch (error: any) {
    console.log("error updating wallet for new transaction", error);
    
    if (error.code === 'permission-denied') {
      return { success: false, message: "Permission denied. Please check your authentication and security rules." };
    }
    
    return { success: false, message: error.message };
  }
};

const revertAndUpdateWallets = async (
  oldTransaction: TransactionType,
  newTransactionAmount: number,
  newTransactionType: string,
  newWalletId: string
) => {
  try {
    // Check authentication
    if (!auth.currentUser) {
      return { success: false, message: "User not authenticated" };
    }

    const originalWalletSnapshot = await getDoc(
      doc(firestore, "wallets", oldTransaction.walletId)
    );
    
    if (!originalWalletSnapshot.exists()) {
      return { success: false, message: "Original wallet not found" };
    }
    
    const originalWallet = originalWalletSnapshot.data() as WalletType;

    let newWalletSnapshot = await getDoc(
      doc(firestore, "wallets", newWalletId)
    );
    
    if (!newWalletSnapshot.exists()) {
      return { success: false, message: "New wallet not found" };
    }
    
    let newWallet = newWalletSnapshot.data() as WalletType;

    const revertType =
      oldTransaction.type === "income" ? "totalIncome" : "totalExpenses";

    const revertIncomeExpense =
      oldTransaction.type === "income"
        ? -Number(oldTransaction.amount)
        : Number(oldTransaction.amount);

    const revertedWalletAmount =
      Number(originalWallet.amount) + revertIncomeExpense;

    const revertedIncomeExpenseAmount =
      Number(originalWallet[revertType]) - Number(oldTransaction.amount);

    if (newTransactionType === "expense") {
      if (
        oldTransaction.walletId === newWalletId &&
        revertedWalletAmount < newTransactionAmount
      ) {
        return {
          success: false,
          message: "The selected wallet don't have enough balance",
        };
      }

      if (newWallet.amount! < newTransactionAmount) {
        return {
          success: false,
          message: "Insufficient funds in wallet for this transaction",
        };
      }
    }

    await createOrUpdateWallet({
      id: oldTransaction.walletId,
      amount: revertedWalletAmount,
      [revertType]: revertedIncomeExpenseAmount,
    });

    // refetching new wallet
    newWalletSnapshot = await getDoc(
      doc(firestore, "wallets", newWalletId)
    );
    newWallet = newWalletSnapshot.data() as WalletType;

    const updateType = newTransactionType === 'income' ? 'totalIncome' : 'totalExpenses';
    const updatedTransactionAmount: number =
      newTransactionType === "income"
        ? Number(newTransactionAmount) 
        : -Number(newTransactionAmount);

    const newWalletAmount = Number(newWallet.amount) + updatedTransactionAmount;

    const newIncomeExpenseAmount = Number(newWallet[updateType]!) + Number(newTransactionAmount);

    await createOrUpdateWallet({
      id: newWalletId,
      amount: newWalletAmount,
      [updateType]: newIncomeExpenseAmount,
    });

    return { success: true };
  } catch (error: any) {
    console.log("error updating wallet for new transaction", error);
    
    if (error.code === 'permission-denied') {
      return { success: false, message: "Permission denied. Please check your authentication and security rules." };
    }
    
    return { success: false, message: error.message };
  }
};