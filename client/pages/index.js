import axios from "axios";
const IndexPage = ({ currentUser }) => {
  return currentUser ? (
    <h1>hello {currentUser.email}</h1>
  ) : (
    <h1>not signed in</h1>
  );
};
// executed in the server side
// except when redirected from the same app
IndexPage.getInitialProps = async ({ req }) => {
  let url = "";
  let headers = {};
  if (typeof window === "undefined") {
    // servicename.namespace.svc.cluster.local
    url =
      "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser";
    headers = { ...req.headers };
  } else {
    url = "/api/users/currentuser";
  }
  const res = await axios.get(url, { headers });
  return res.data;
};

export default IndexPage;
