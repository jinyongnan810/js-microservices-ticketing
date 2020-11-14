import express from "express";
require("express-async-errors");
import { json } from "body-parser";

import CurrentUserRouter from "./routers/current-user";
import SignInRouter from "./routers/signin";
import SignOutRouter from "./routers/signout";
import SignUpRouter from "./routers/signup";
import { handleError } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.use(json());

app.use(CurrentUserRouter);
app.use(SignInRouter);
app.use(SignOutRouter);
app.use(SignUpRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(handleError);

app.listen(3000, () => {
  console.log("Auth service listening on port 3000.");
});
