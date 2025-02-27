import { Constants } from "@/constants";
import { Utils } from "@/utils";
import Axios from "axios";

const axios = Axios.create({
  baseURL: Constants.BACKEND_URL,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "Origin": Constants.APP_URL,
  },
  withCredentials: true,
  withXSRFToken: true,
});

axios.interceptors.request.use(
  (config) => {
    // Get base URL
    const baseUrl = Utils.Url.getBackendUrl();
    
    // Encode the URL if using CORS proxy
    if (baseUrl.includes("services.f-ck.me")) {
      const fullUrl = `${Constants.BACKEND_URL}${config.url}`;
      config.url = Utils.Url.encodeBase64Url(fullUrl);
      config.baseURL = `${Constants.CORS_URL}/v1/cors`;
    } else {
      config.baseURL = baseUrl;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export { axios };
