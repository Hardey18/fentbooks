import axios from "../axios";
const userDetails: any = localStorage.getItem("userToken");

export const EmailService = {
  emailInvoice: async (invoiceId: any) => {
    let response;
    try {
      response = await axios.post(
        `/email/send-mail/${invoiceId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${userDetails}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      response = error;
    }
    return response;
  },
};
