import axios from "../axios";

export const AuthService = {
  signUp: async (payload: any) => {
    let response;
    try {
      response = await axios.post("/user/create", payload, {
        headers: { "Content-Type": "application/json", accept: "*/*" },
      });
    } catch (error) {
      response = error;
    }
    return response;
  },
  login: async (payload: any) => {
    let response;
    try {
      response = await axios.post("/user/login", payload, {
        headers: { "Content-Type": "application/json", accept: "*/*" },
      });
    } catch (error) {
      response = error;
    }
    return response;
  },
  updateUser: async (payload: any) => {
    let response;
    const userDetails: any = localStorage.getItem("userToken");
    try {
      response = await axios.put("/user/update", payload, {
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
  updatePhoto: async (payload: any) => {
    let response;
    const userDetails: any = localStorage.getItem("userToken");
    try {
      response = await axios.put("/user/updatePhoto", payload, {
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
  getProfile: async (userId: string) => {
    let response;
    const userDetails: any = localStorage.getItem("userToken");
    try {
      response = await axios.get(`/user/getUser/${userId}`, {
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
