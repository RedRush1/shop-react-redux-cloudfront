const API_PATHS = {
  product: "https://xeyb3ihz46.execute-api.us-east-1.amazonaws.com/prod",
  order: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  import: "https://16x47v55a2.execute-api.us-east-1.amazonaws.com/prod",
  bff: "https://.execute-api.eu-west-1.amazonaws.com/dev",
  cart: import.meta.env.VITE_CART_API_URL as string ?? "",
};

export default API_PATHS;
