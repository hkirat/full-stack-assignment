import { Jwt, JwtPayload, Secret, VerifyErrors } from "jsonwebtoken";
import { NextFunction, Response } from "express";
import { CustomRequest, TokenObject } from "../types/user";
import jwt from "jsonwebtoken";

export const secret: Secret = "abcd4321";

export const userAuthorization = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  const ver: jwt.VerifyCallback<JwtPayload | string | undefined> = function (
    err: VerifyErrors | null,
    decoded: JwtPayload | string | undefined
  ) {
    if (err) {
      return res.status(401).send("Unauthorized");
    }
    const tokenObj = decoded as TokenObject;
    if (!tokenObj) {
      return res.status(500).send("Internal server error");
    }

    console.log(tokenObj);
    req.userId = tokenObj.userId;
    next();
  };

  jwt.verify(token, secret, ver);
};

export const adminAuthorization = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  jwt.verify(
    token,
    secret,
    {},
    (err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
      if (err) {
        return res.status(401).send("Unauthorized");
      }
      const tokenObj = decoded as TokenObject;
      if (!tokenObj) {
        return res.status(500).send("Internal server error");
      }
      if (tokenObj.userType !== "admin") {
        return res.status(401).send("Unauthorized");
      }
      console.log(tokenObj);
      req.userId = tokenObj.userId;
      next();
    }
  );
};
