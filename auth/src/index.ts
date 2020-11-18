import express from "express";
require("express-async-errors");
import { json } from "body-parser";
import mongoose from "mongoose";
import cookieSesion from "cookie-session";

import CurrentUserRouter from "./routers/current-user";
import SignInRouter from "./routers/signin";
import SignOutRouter from "./routers/signout";
import SignUpRouter from "./routers/signup";
import { handleError } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.set("trust proxy", true); //trust ingress nginx
app.use(json());
app.use(
  cookieSesion({
    signed: false, // no encryption
    secure: true, // only https
  })
);

app.use(CurrentUserRouter);
app.use(SignInRouter);
app.use(SignOutRouter);
app.use(SignUpRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(handleError);

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY not set.");
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("DB connected.");
  } catch (error) {
    console.log(error.messsage);
  }

  app.listen(3000, async () => {
    console.log("Auth service listening on port 3000.");
  });
};

start();
