import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  UnAuthorizedError,
  validateRequest,
} from "@jinyongnan810/ticketing-common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import { Order } from "../models/order";
import { stripe } from "../stripe";
const router = express.Router();
router.post(
  "/api/payments",
  requireAuth,
  [body("orderId").notEmpty(), body("token").notEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId, token } = req.body;
    const order = await Order.findById(orderId);
    if (!order) {
      throw new NotFoundError();
    }
    if (order.userId !== req.currentUser!.id) {
      throw new UnAuthorizedError();
    }
    if (
      order.status === OrderStatus.CANCELLED ||
      order.status === OrderStatus.COMPLETE
    ) {
      throw new BadRequestError("Order not waiting for payment.");
    }
    await stripe.charges.create({
      amount: order.price * 100, // usd cents
      currency: "usd",
      source: token,
    });

    res.send({});
  }
);
export { router as NewPaymentRouter };
