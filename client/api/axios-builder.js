import axios from "axios";
const CustomAxiosClient = ({ req }) => {
  if (typeof window === "undefined") {
    // servicename.namespace.svc.cluster.local
    return axios.create({
      baseURL:
        "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
      headers: req.headers,
    });
  } else {
    return axios.create({
      baseURL: "/",
    });
  }
};
export default CustomAxiosClient;
