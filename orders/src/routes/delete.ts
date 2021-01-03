import { NotFoundError, requireAuth } from "@jinyongnan810/ticketing-common";
import express, { Request, Response } from "express";

const Router = express.Router();

Router.delete(
  "/api/orders/:orderId",
  requireAuth,
  async (req: Request, res: Response) => {
    res.status(200).send({});
  }
);
export default Router;
