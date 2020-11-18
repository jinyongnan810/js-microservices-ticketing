import request from "supertest";
import { app } from "../../app";

it("normal signup", async () => {
  const res = await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "test",
    })
    .expect(201);
  expect(res.get("Set-Cookie")).toBeDefined(); // check cookie is set
});

it("abnormal signup", async () => {
  const res = await request(app)
    .post("/api/users/signup")
    .send({
      email: "testtest.com",
      password: "tes",
    })
    .expect(400);

  expect(res.body).toHaveProperty("errors");
  expect(res.body.errors).toHaveLength(1);
  expect(res.body.errors[0]["field"]).toEqual("email");
});

it("empty request", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
    })
    .expect(400);
  await request(app)
    .post("/api/users/signup")
    .send({
      password: "test",
    })
    .expect(400);
});

it("duplicate signup", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "test",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "test",
    })
    .expect(400);
});
