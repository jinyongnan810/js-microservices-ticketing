import Router from "next/router";
import { useEffect } from "react";
import useRequest from "../../hooks/use-request";

const SignoutPage = () => {
  const { doRequest, errors } = useRequest(
    "/api/users/signout",
    "post",
    {},
    () => Router.push("/")
  );
  const signOut = async () => {
    await doRequest();
  };
  useEffect(async () => {
    await signOut();
  }, []);

  return <div></div>;
};
export default SignoutPage;
