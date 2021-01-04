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
import { natsWrapper } from "../events/nats-wrapper";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";

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
    const expiredAt = new Date();
    expiredAt.setSeconds(expiredAt.getSeconds() + EXPIRE_WINDOW);
    const order = await Order.build({
      userId: req.currentUser!.id,
      expiredAt: expiredAt,
      status: OrderStatus.CREATED,
      ticket: ticket,
    });
    await order.save();

    // publish order created event
    await new OrderCreatedPublisher(natsWrapper.client).publish({
      id: order.id,
      userId: order.userId,
      status: order.status,
      expiredAt: order.expiredAt.toISOString(),
      ticket: {
        id: ticketId,
        price: ticket.price,
      },
    });

    res.status(201).send(order);
  }
);
export default Router;
