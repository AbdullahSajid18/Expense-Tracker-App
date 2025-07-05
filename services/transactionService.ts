import { TransactionType } from "@/types";




export const createOrUpdateTransaction = async (
    transactionData: Partial<TransactionType>
) => {
    try {
        const {id, type, walletId, amount, image} = transactionData;
        if(!amount || amount <= 0 || !walletId || !type) {
            return {success: false, message: 'invalid transaction data'}
        }
        
        if(id) {
            // todo: update existing transaction
        } else {
            // update wallet for new transaction
            // update wallet
        }
      } catch (error: any) {
        console.log("error creating or updating transaction", error);
        return {success: false, message: error.message}
    
        
    }
};

const updateWalletForNewTransaction = async (
    waleltId: string,
    amount: number,
    type: string,
)  => {
    try {
        
    } catch (error: any) {
        console.log("error updating wallet for new transaction", error);
        return {success: false, message: error.message}
        
    }
}