// Check if input is empty
export const inputValidationError = (field: any, input: any) => {
  if (!field && field !== undefined && input === "email") {
    return "| Email is required!";
  }
  if (!field && field !== undefined && input === "password") {
    return "| Password is required!";
  }
  if (!field && field !== undefined && input === "customerName") {
    return "| Customer Name is required!";
  }
  if (!field && field !== undefined && input === "customerEmail") {
    return "| Customer Email is required!";
  }
  if (!field && field !== undefined && input === "phoneNumber") {
    return "| Phone Number is required!";
  }
  if (!field && field !== undefined && input === "addressLine") {
    return "| Address Line is required!";
  }
  if (!field && field !== undefined && input === "city") {
    return "| City is required!";
  }
  if (!field && field !== undefined && input === "state") {
    return "| State is required!";
  }
  if (!field && field !== undefined && input === "note") {
    return "| Note is required!";
  }
  if (!field && field !== undefined && input === "productName") {
    return "| Product Name is required!";
  }
  if (!field && field !== undefined && input === "description") {
    return "| Description is required!";
  }
  if (!field && field !== undefined && input === "price") {
    return "| Price is required!";
  }
};

export const numberWithCommas = (x: any) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
