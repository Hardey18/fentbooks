import axios from "../axios";
const userDetails: any = localStorage.getItem("userToken");

export const CategoryService = {
  createCategory: async (payload: any) => {
    let response;
    try {
      response = await axios.post("/category/create", payload, {
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
  getCategories: async () => {
    let response;
    try {
      response = await axios.get(`/category/getAll`, {
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
