import { Api } from "./routesApi";
const baseUrl = import.meta.env.VITE_APP_API_URL;
export const useAuth = () => {
  const registerUser = async (data: any, signal:AbortSignal, handler: Function) => {
    return await fetch(baseUrl + Api.register, {
      signal,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => handler(res));
  };
  const loginUser = async (data: any, handler: Function) => {
    return await fetch(baseUrl + Api.login, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => handler(res.json()));
  };
  return { registerUser, loginUser };
};
