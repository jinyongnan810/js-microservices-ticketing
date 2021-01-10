import {
  NotFoundError,
  requireAuth,
  UnAuthorizedError,
  validateRequest,
} from "@jinyongnan810/ticketing-common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { natsWrapper } from "../events/nats-wrapper";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { Ticket } from "../models/ticket";

const Router = express.Router();

Router.put(
  "/api/tickets/:id",
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
    const { id } = req.params;
    let found;
    try {
      found = await Ticket.findById(id);
    } catch (error) {
      throw new NotFoundError();
    }
    if (!found) {
      throw new NotFoundError();
    }
    const userId = req.currentUser!.id;
    if (userId !== found.userId) {
      throw new UnAuthorizedError();
    }
    if (found.orderId) {
      throw new UnAuthorizedError();
    }

    const { title, price } = req.body;
    found.set({ title, price });
    await found.save();
    new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: found.id,
      title: found.title,
      price: found.price,
      userId: found.userId,
      version: found.version,
    });
    res.status(200).send(found);
  }
);
export default Router;
