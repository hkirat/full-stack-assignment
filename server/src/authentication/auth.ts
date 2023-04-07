import jwt from "jsonwebtoken";
import express from "express";

const userAuthentication = function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    let token: any = req.headers["x-api-key"];

    if (!token)
      return res
        .status(400)
        .send({ status: false, message: "token must be present " });

    jwt.verify(token, "5^8LydB!mso^o!YxUser", function (err: Error) {
      if (err)
        return res
          .status(401)
          .send({ status: false, message: "token is not valid" });
      next();
    });
  } catch (err) {
    res
      .status(500)
      .send({ status: false, message: "Error", error: err.message });
  }
};

const adminAuthentication = function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  try {
    let token: any = req.headers["x-api-key"];

    if (!token)
      return res
        .status(400)
        .send({ status: false, message: "token must be present " });

    jwt.verify(token, "Admin5^8LydB!mso^o!Yx", function (err: Error) {
      if (err)
        return res
          .status(401)
          .send({ status: false, message: "token is not valid" });
      next();
    });
  } catch (err) {
    res
      .status(500)
      .send({ status: false, message: "Error", error: err.message });
  }
};

module.exports = { userAuthentication, adminAuthentication };
