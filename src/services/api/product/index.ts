import axios from "../axios";
const userDetails: any = localStorage.getItem("userToken");

export const ProductService = {
  createProduct: async (payload: any, categoryId: string) => {
    let response;
    try {
      response = await axios.post(`/product/create/${categoryId}`, payload, {
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
  getProducts: async () => {
    let response;
    try {
      response = await axios.get(`/product/getAll`, {
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
