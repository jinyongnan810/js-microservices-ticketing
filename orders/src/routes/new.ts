import {
  NotFoundError,
  requireAuth,
  validateRequest,
} from "@jinyongnan810/ticketing-common";
import express, { Request, Response } from "express";
import { body } from "express-validator";
import mongoose from "mongoose";

const Router = express.Router();

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
    res.status(200).send({});
  }
);
export default Router;
