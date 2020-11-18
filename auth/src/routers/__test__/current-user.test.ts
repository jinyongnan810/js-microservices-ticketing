import request from "supertest";
import { app } from "../../app";

it("get user after signed in", async () => {
  const cookie = await global.signup();
  const res = await request(app)
    .get("/api/users/currentuser")
    .set("Cookie", cookie)
    .send()
    .expect(200);
  expect(res.body.currentUser).toBeTruthy();
  expect(res.body.currentUser.email).toEqual("test@test.com");
});

it("get user without signed in", async () => {
  const res = await request(app)
    .get("/api/users/currentuser")
    .send()
    .expect(200);
  expect(res.body.currentUser).toBeNull();
});
