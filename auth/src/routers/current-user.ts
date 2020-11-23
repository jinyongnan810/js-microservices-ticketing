import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { BadRequestError } from "@jinyongnan810/ticketing-common";
import { currentUser } from "@jinyongnan810/ticketing-common";
import { requireAuth } from "@jinyongnan810/ticketing-common";
const router = express.Router();

router.get(
  "/api/users/currentuser",
  currentUser,
  (req: Request, res: Response) => {
    return res.send({ currentUser: req.currentUser || null });
  }
);

export default router;
