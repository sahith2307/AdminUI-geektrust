import axios from "axios";

const get = async (url: string, config?: any) => {
  const fetched = await axios.get(url, { headers: config || {} });
  return fetched.data;
};

export const ApiCalls = { get };
