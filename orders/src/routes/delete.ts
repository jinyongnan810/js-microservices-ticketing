import {
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@jinyongnan810/ticketing-common";
import express, { Request, Response } from "express";
import { natsWrapper } from "../events/nats-wrapper";
import { OrderCancelledPublisher } from "../events/publishers/order-cancelled-publisher";
import { Order } from "../models/order";

const Router = express.Router();

Router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");
    if (order && order.userId === req.currentUser!.id) {
      order.status = OrderStatus.CANCELLED;
      await order.save();
      // publish order cancelled event
      await new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        ticket: {
          id: order.ticket.id,
        },
      });
      res.status(204).end();
    } else {
      throw new NotFoundError();
    }
  }
);
export default Router;