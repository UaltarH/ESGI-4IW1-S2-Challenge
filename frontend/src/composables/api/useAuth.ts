import { Api } from "./routesApi";
const baseUrl = import.meta.env.VITE_APP_API_URL;
export const useAuth = () => {
  const registerUser = async (data: any, signal: AbortSignal, handler: Function) => {
    return await fetch(baseUrl + Api.register, {
      signal,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => handler(res));
  };
  const loginUser = async (data: any) => {
    return await fetch(baseUrl + Api.login, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then((res) => res);
  };
  const verifyUser = async (token: string) => {
    return await fetch(baseUrl + Api.verify + token, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  return { registerUser, loginUser, verifyUser };
};
