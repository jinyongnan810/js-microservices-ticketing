import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from "@jinyongnan810/ticketing-common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";
import { Order } from "../models/order";
import { Ticket } from "../models/ticket";

const Router = express.Router();
const EXPIRE_WINDOW = 15 * 60;

Router.post(
  "/api/orders",
  requireAuth,
  [
    body("ticketId")
      .notEmpty()
      .custom((input: string) => mongoose.Types.ObjectId.isValid(input)) // check valid mongoid
      .withMessage("Ticket Id must be provided."),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;
    // check ticket exists
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      throw new NotFoundError();
    }

    // check the ticket is reserved
    const isReserved = await ticket.isReserved();
    if (isReserved) {
      throw new BadRequestError("Ticket is already reserved.");
    }

    // create an order
    const expireAt = new Date();
    expireAt.setSeconds(expireAt.getSeconds() + EXPIRE_WINDOW);
    const order = await Order.build({
      userId: req.currentUser!.id,
      expireAt: expireAt,
      status: OrderStatus.CREATED,
      ticket: ticket,
    });
    await order.save();

    res.status(201).send(order);
  }
);
export default Router;
