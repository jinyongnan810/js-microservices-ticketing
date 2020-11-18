import mongoose from "mongoose";
import { app } from "./app";
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY not set.");
  }
  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("DB connected.");
  } catch (error) {
    console.log(error.messsage);
  }

  app.listen(3000, async () => {
    console.log("Auth service listening on port 3000.");
  });
};

start();
