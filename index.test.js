const request = require("supertest");
const app = require("./index");

describe("POST /signup", () => {
  it("should return a correct user signup", async () => {
    const response = await request(app)
      .post("/signup")
      .set("Content-Type", "application/json")
      .send({ email: "john@gmail.com", password: "johnDoe" });

    expect(response.status).toEqual(200);
    expect(response.get("Content-Type")).toMatch(/application\/json/);
    expect(response.body).toHaveProperty("message");
  });

  it("should return an error signup needs email and password", async () => {
    const response = await request(app)
      .post("/signup")
      .set("Content-Type", "application/json")
      .send({ email: "john@gmail.com" });

    expect(response.status).toEqual(400);
    expect(response.get("Content-Type")).toMatch(/application\/json/);
    expect(response.body.error).toBe("Signup needs valid email and password");
  });

  it("should return an error email already registred", async () => {
    const response = await request(app)
      .post("/signup")
      .set("Content-Type", "application/json")
      .send({ email: "walt@gmail.com", password: "disnei" });

    expect(response.status).toEqual(409);
    expect(response.get("Content-Type")).toMatch(/application\/json/);
    expect(response.body).toHaveProperty("error");
  });
});

describe("POST /login", () => {
  it("should return a correct user login with token", async () => {
    const response = await request(app)
      .post("/login")
      .set("Content-Type", "application/json")
      .send({ email: "walt@gmail.com", password: "disnei" });

    expect(response.status).toEqual(200);
    expect(response.get("Content-Type")).toMatch(/application\/json/);
    expect(response.body).toHaveProperty("message");
    expect(response.body).toHaveProperty("token");
  });

  it("should return an error email no found", async () => {
    const response = await request(app)
      .post("/login")
      .set("Content-Type", "application/json")
      .send({ email: "bob@gmail.com", password: "dope" });

    expect(response.status).toEqual(400);
    expect(response.get("Content-Type")).toMatch(/application\/json/);
    expect(response.body).toHaveProperty("error");
  });

  it("should return an error invalid password", async () => {
    const response = await request(app)
      .post("/login")
      .set("Content-Type", "application/json")
      .send({ email: "walt@gmail.com", password: "dysney" });

    expect(response.status).toEqual(401);
    expect(response.get("Content-Type")).toMatch(/application\/json/);
    expect(response.body).toHaveProperty("error");
  });
});

describe("GET /questions", () => {
  it("should return a questions with all the questions array", async () => {
    const response = await request(app).get("/questions");

    expect(response.status).toEqual(200);
    expect(response.get("Content-Type")).toMatch(/application\/json/);
    expect(response.body).toHaveProperty("questions");
  });
});

describe("GET /submissions", () => {
  it("should return a questions with all the questions array", async () => {
    const response = await request(app).get("/submissions");

    expect(response.status).toEqual(200);
    expect(response.get("Content-Type")).toMatch(/application\/json/);
    expect(response.body).toHaveProperty("submissions");
  });
});

// describe("POST /submissions", () => {
//   it("should return a correct user login with token", async () => {
//     const response = await request(app)
//       .post("/submissions")
//       .set("Content-Type", "application/json")
//       .send({ submission: "new submission" });

//     expect(response.status).toEqual(200);
//     expect(response.get("Content-Type")).toMatch(/application\/json/);
//     expect(response.body).toHaveProperty("message");
//   });

//   it("should return a correct user login with token", async () => {
//     const response = await request(app)
//       .post("/submissions")
//       .set("Content-Type", "application/json")
//       .send({ submission: "new submission" });

//     expect(response.status).toEqual(400);
//     expect(response.get("Content-Type")).toMatch(/application\/json/);
//     expect(response.body).toHaveProperty("error");
//   });
// });

describe("POST /admin", () => {
  it("should return a correct user login with token", async () => {
    const response = await request(app)
      .post("/admin")
      .set("Content-Type", "application/json")
      .send({
        email: "walt@gmail.com",
        password: "disnei",
        problem: { title: "new problem" },
      });

    expect(response.status).toEqual(200);
    expect(response.get("Content-Type")).toMatch(/application\/json/);
    expect(response.body).toHaveProperty("message");
  });

  it("should return a correct user login with token", async () => {
    const response = await request(app)
      .post("/admin")
      .set("Content-Type", "application/json")
      .send({
        problem: { title: "new problem" },
      });

    expect(response.status).toEqual(400);
    expect(response.get("Content-Type")).toMatch(/application\/json/);
    expect(response.body).toHaveProperty("error");
  });

  it("should return a correct user login with token", async () => {
    const response = await request(app)
      .post("/admin")
      .set("Content-Type", "application/json")
      .send({
        email: "bob@gmail.com",
        password: "dope",
        problem: { title: "new problem" },
      });

    expect(response.status).toEqual(401);
    expect(response.get("Content-Type")).toMatch(/application\/json/);
    expect(response.body).toHaveProperty("error");
  });

  it("should return a correct user login with token", async () => {
    const response = await request(app)
      .post("/admin")
      .set("Content-Type", "application/json")
      .send({
        email: "walt@gmail.com",
        password: "dysney",
        problem: { title: "new problem" },
      });

    expect(response.status).toEqual(401);
    expect(response.get("Content-Type")).toMatch(/application\/json/);
    expect(response.body).toHaveProperty("error");
  });

  it("should return a correct user login with token", async () => {
    const response = await request(app)
      .post("/admin")
      .set("Content-Type", "application/json")
      .send({
        email: "ana@gmail.com",
        password: "marie",
        problem: { title: "new problem" },
      });

    expect(response.status).toEqual(403);
    expect(response.get("Content-Type")).toMatch(/application\/json/);
    expect(response.body).toHaveProperty("error");
  });
});
