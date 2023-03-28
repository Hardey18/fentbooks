import axios from "../axios";
const userDetails: any = localStorage.getItem("userToken");

export const InvoiceService = {
  createInvoice: async (payload: any, customerId: string, productId: string) => {
    let response;
    try {
      response = await axios.post(`/invoice/create/${customerId}/${productId}`, payload, {
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
  verifyInvoice: async (invoiceId: any) => {
    let response;
    try {
      response = await axios.post(`/invoice/verify/${invoiceId}`, {}, {
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
  getInvoice: async () => {
    let response;
    try {
      response = await axios.get(`/invoice/getAll`, {
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
  getSingleInvoice: async (id: any) => {
    let response;
    try {
      response = await axios.get(`/invoice/getSingle/${id}`, {
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
