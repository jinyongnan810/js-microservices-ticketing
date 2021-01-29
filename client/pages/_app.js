import "bootstrap/dist/css/bootstrap.css";

import Header from "../components/header";
import CustomAxiosClient from "../api/axios-builder";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className="container">
        <Component currentUser={currentUser} {...pageProps} />
      </div>
    </div>
  );
};
AppComponent.getInitialProps = async (context) => {
  const client = CustomAxiosClient(context.ctx);
  const res = await client.get("/api/users/currentuser");
  // call nested component's getInitialProps
  let pageProps;
  if (context.Component.getInitialProps) {
    pageProps = await context.Component.getInitialProps(
      context.ctx,
      client,
      res.data.currentUser
    );
  }
  return { pageProps, currentUser: res.data.currentUser };
};
export default AppComponent;
