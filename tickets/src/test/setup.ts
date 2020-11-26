import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../app";

declare global {
  namespace NodeJS {
    interface Global {
      signup(): string[];
    }
  }
}

let mongo: any;

beforeAll(async () => {
  // set env
  process.env.JWT_KEY = "secret";

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(async () => {
  // get all collections
  const collections = await mongoose.connection.db.collections();
  // loop and delete all
  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signup = () => {
  const payload = { id: "123456", email: "test@test.com" };
  const jwtToken = jwt.sign(payload, process.env.JWT_KEY!);
  const session = { jwt: jwtToken };
  const str = JSON.stringify(session);
  const base64 = Buffer.from(str).toString("base64");
  const cookie = "express:sess=" + base64;
  return [cookie];
};
