import { NotFoundError, requireAuth } from "@jinyongnan810/ticketing-common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";

const Router = express.Router();

Router.get(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    const order = await Order.findById(req.params.orderId).populate("ticket");
    if (order && order.userId === req.currentUser!.id) {
      res.status(200).send(order);
    } else {
      throw new NotFoundError();
    }
  }
);
export default Router;
