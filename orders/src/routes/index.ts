import { NotFoundError, requireAuth } from "@jinyongnan810/ticketing-common";
import express, { Request, Response } from "express";
import { Order } from "../models/order";

const Router = express.Router();

Router.get("/api/orders", requireAuth, async (req: Request, res: Response) => {
  try {
    const orders = await Order.find({ userId: req.currentUser!.id }).populate(
      "ticket"
    );
    res.status(200).send(orders);
  } catch (error) {
    console.log("error:", error);
    throw error;
  }
});
export default Router;
