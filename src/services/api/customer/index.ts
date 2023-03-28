import axios from "../axios";
const userDetails: any = localStorage.getItem("userToken");

export const CustomerService = {
  createCustomer: async (payload: any) => {
    let response;
    try {
      response = await axios.post("/customer/create", payload, {
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
  getCustomers: async () => {
    let response;
    try {
      response = await axios.get(`/customer/getAll`, {
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
