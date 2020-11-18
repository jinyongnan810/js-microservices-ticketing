import express, { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../errors/bad-request-error";
const router = express.Router();

router.get("/api/users/currentuser", (req: Request, res: Response) => {
  const jwt_token = req.session?.jwt;
  if (jwt_token) {
    try {
      const payload = jwt.verify(jwt_token, process.env.JWT_KEY!);
      return res.send({ currentUser: payload });
    } catch (error) {
      return res.send({ currentUser: null });
    }
  }
  return res.send({ currentUser: null });
});

export default router;
