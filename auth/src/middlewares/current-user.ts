import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
// define payload format
interface UserPayload {
  id: string;
  email: string;
}

// add properties to Request
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserPayload;
    }
  }
}

export const currentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const jwt_token = req.session?.jwt;
  if (jwt_token) {
    try {
      const payload = jwt.verify(
        jwt_token,
        process.env.JWT_KEY!
      ) as UserPayload;
      req.currentUser = payload;
    } catch (error) {}
  }
  next();
};
