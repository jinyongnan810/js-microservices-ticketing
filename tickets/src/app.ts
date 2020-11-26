import express from "express";
require("express-async-errors");
import { json } from "body-parser";

import cookieSesion from "cookie-session";

import { currentUser, handleError } from "@jinyongnan810/ticketing-common";
import { NotFoundError } from "@jinyongnan810/ticketing-common";

import NewTicketRouter from "./routes/new";
import ShowTicketRouter from "./routes/show";
import AllTicketsRouter from "./routes/all";
import UpdateTicketRouter from "./routes/update";

const app = express();
app.set("trust proxy", true); //trust ingress nginx
app.use(json());
app.use(
  cookieSesion({
    signed: false, // no encryption
    secure: process.env.NODE_ENV !== "test", // only https
  })
);

// get auth info
app.use(currentUser);

app.use(NewTicketRouter);
app.use(ShowTicketRouter);
app.use(AllTicketsRouter);
app.use(UpdateTicketRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});

app.use(handleError);

export { app };
