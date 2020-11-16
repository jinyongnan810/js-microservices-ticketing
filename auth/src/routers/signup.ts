import express, { Request, Response } from "express";
import { body, validationResult } from "express-validator";
import { BadRequestError } from "../errors/bad-request-error";
import { RequestValidationError } from "../errors/validation-error";
import { User } from "../models/user";
const router = express.Router();
router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be valid."),
    body("password")
      .isLength({ min: 3, max: 20 })
      .withMessage("Password must be within 3-20 characters."),
  ],
  async (req: Request, res: Response) => {
    // check errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new RequestValidationError(errors.array());
    }

    const { email, password } = req.body;
    // check email
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      throw new BadRequestError("Email in use.");
    } else {
      // create user
      const newUser = User.build({ email, password });
      await newUser.save();
      return res.status(201).send(newUser);
    }
  }
);
export default router;
