import mongoose from "mongoose";
import { app } from "./app";
const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY not set.");
  }
  try {
    await mongoose.connect("mongodb://tickets-mongo-srv:27017/tickets", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("DB connected.");
  } catch (error) {
    console.log(error.messsage);
  }

  app.listen(3000, async () => {
    console.log("tickets service listening on port 3000.");
  });
};

start();
