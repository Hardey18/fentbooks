import axios from "../axios";
const userDetails: any = localStorage.getItem("userToken");

export const TransactionService = {
  createTransaction: async (payload: any, categoryId: string) => {
    let response;
    try {
      response = await axios.post(`/transaction/create/${categoryId}`, payload, {
        headers: {
          Authorization: `Bearer ${userDetails}`,
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      response = error;
    }
    return response;
  },
  getTransactions: async () => {
    let response;
    try {
      response = await axios.get(`/transaction/getAll`, {
        headers: {
          Authorization: `Bearer ${userDetails}`,
          "Content-Type": "application/json",
        },
      });
      return response;
    } catch (error) {
      response = error;
    }
    return response;
  },
};
