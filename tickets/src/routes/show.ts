import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@jinyongnan810/ticketing-common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Ticket } from "../models/ticket";

const Router = express.Router();

Router.get(
  "/api/tickets/:id",

  async (req: Request, res: Response) => {
    const { id } = req.params;
    let ticketFound;
    try {
      ticketFound = await Ticket.findById(id);
    } catch (error) {
      throw new NotFoundError();
    }

    if (!ticketFound) {
      throw new NotFoundError();
    }
    res.status(200).send(ticketFound);
  }
);
export default Router;
