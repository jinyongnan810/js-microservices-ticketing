import CustomAxiosClient from "../api/axios-builder";

const IndexPage = ({ currentUser }) => {
  return <h1>Landing Page</h1>;
};
// executed in the server side
// except when redirected from the same app
IndexPage.getInitialProps = async (context) => {
  const res = await CustomAxiosClient(context).get("/api/users/currentuser");
  return res.data;
};

export default IndexPage;
