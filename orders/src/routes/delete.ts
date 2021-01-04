import {
  NotFoundError,
  OrderStatus,
  requireAuth,
} from "@jinyongnan810/ticketing-common";
import express, { Request, Response } from "express";
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
      res.status(204).end();
    } else {
      throw new NotFoundError();
    }
  }
);
export default Router;
