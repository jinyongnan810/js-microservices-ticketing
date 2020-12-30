import { requireAuth, validateRequest } from "@jinyongnan810/ticketing-common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { natsWrapper } from "../events/nats-wrapper";
import { Ticket } from "../models/ticket";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";

const Router = express.Router();

Router.post(
  "/api/tickets",
  requireAuth,
  [
    body("title").trim().notEmpty().withMessage("Title must be provided."),
    body("price")
      .trim()
      .notEmpty()
      .withMessage("Price must be provided.")
      .isFloat({ gt: 0 })
      .withMessage("Price must be a a positive number"),
  ],
  validateRequest,

  async (req: Request, res: Response) => {
    const { title, price } = req.body;
    const userId = req.currentUser!.id;
    const newTicket = Ticket.build({ title, price, userId });
    await newTicket.save();
    new TicketCreatedPublisher(natsWrapper.client).publish({
      id: newTicket.id,
      title: newTicket.title,
      price: newTicket.price,
      userId: newTicket.userId,
    });
    res.status(201).send(newTicket);
  }
);
export default Router;
