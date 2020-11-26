import { NotFoundError } from "@jinyongnan810/ticketing-common";
import express, { Request, Response } from "express";
import { Ticket } from "../models/ticket";

const Router = express.Router();

Router.get(
  "/api/tickets",

  async (req: Request, res: Response) => {
    const tickets = await Ticket.find({});
    res.status(200).send(tickets);
  }
);
export default Router;
