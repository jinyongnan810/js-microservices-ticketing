import "bootstrap/dist/css/bootstrap.css";
import CustomAxiosClient from "../api/axios-builder";

const AppComponent = ({ Component, pageProps, currentUser }) => {
  return currentUser ? (
    <div>
      <h1>hello {currentUser.email}</h1>
      <Component {...pageProps} />
    </div>
  ) : (
    <div>
      <h1>not signed in.</h1>
      <Component {...pageProps} />
    </div>
  );
  return;
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
