import request from "supertest";
import { app } from "../../app";

beforeEach(async () => {
  // signup
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "test",
    })
    .expect(201);
});

it("normal signin", async () => {
  // sign in
  const res = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "test",
    })
    .expect(200);
  expect(res.get("Set-Cookie")).toBeDefined(); // check cookie is set
});

it("signin with not existing email", async () => {
  // sign in
  const res = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test2@test.com",
      password: "test",
    })
    .expect(400);
  expect(res.get("Set-Cookie")).toBeUndefined();
});

it("signin with wrong password", async () => {
  // sign in
  const res = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "test1",
    })
    .expect(400);
  expect(res.get("Set-Cookie")).toBeUndefined();
});
