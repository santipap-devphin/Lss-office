import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios";
import { apiUrlBase } from "../configs/urls";
import { User } from "../models/user/user.model";
import { getLocalStorage } from "../functions/LocalStorage";

axios.interceptors.request.use<AxiosRequestConfig>(
  (config: AxiosRequestConfig) => {
    const usr = getLocalStorage<User>("__refreshToken");
    if (usr) {
      config.headers = {
        Authorization: `Bearer ${usr.authToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      } as AxiosRequestHeaders;
    }

    return Promise.resolve(config);
  },
  (err) => {
    return Promise.reject(err);
  }
);

export default axios.create({
  baseURL: apiUrlBase,
});
