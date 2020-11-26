import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";

it("/api/tickets POST", async () => {
  const res = await request(app).post("/api/tickets").send({});
  expect(res.status).not.toBe(404);
});

it("/api/tickets POST need auth", async () => {
  const res = await request(app).post("/api/tickets").send({});
  expect(res.status).toBe(401);
});

it("/api/tickets POST has auth", async () => {
  const cookie = global.signup();
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({});
  expect(res.status).not.toBe(401);
});

it("/api/tickets POST invalid inputs", async () => {
  const cookie = global.signup();
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "", price: -1 });
  expect(res.status).toBe(400);
  expect(res.body.errors[0]["field"]).toBe("title");
  expect(res.body.errors[1]["field"]).toBe("price");
});

it("/api/tickets POST valid inputs", async () => {
  const cookie = global.signup();
  const res = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send({ title: "title1", price: "101" });
  expect(res.status).toBe(201);
  const createdOne = await Ticket.findOne({ userId: "123456" });
  expect(createdOne).toBeTruthy();
  expect(createdOne!.price).toBe(101);
  expect(createdOne!.title).toBe("title1");
});
