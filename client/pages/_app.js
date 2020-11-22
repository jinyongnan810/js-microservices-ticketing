import "bootstrap/dist/css/bootstrap.css";

import Header from "../components/header";
import CustomAxiosClient from "../api/axios-builder";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
};
AppComponent.getInitialProps = async (context) => {
  const res = await CustomAxiosClient(context.ctx).get(
    "/api/users/currentuser"
  );
  // call nested component's getInitialProps
  let pageProps;
  if (context.Component.getInitialProps) {
    pageProps = await context.Component.getInitialProps(context.ctx);
  }
  return { pageProps, currentUser: res.data.currentUser };
};
export default AppComponent;
