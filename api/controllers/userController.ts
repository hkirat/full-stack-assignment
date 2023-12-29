import { CustomRequest, User, userMinSchema, userSchema } from "../types/user";
import { Response } from "express";
import jwt from "jsonwebtoken";
import { secret } from "../middleware/auth";
import { PrismaClient } from "@prisma/client";
import cuid from "cuid";

const prisma = new PrismaClient();

export const userSignup = async (req: CustomRequest, res: Response) => {
  try {
    const parsedReq = await userSchema.parseAsync(req.body);
    const user = await prisma.user.findUnique({
      where: {
        email: parsedReq.email,
      },
    });
    if (user) {
      return res.status(400).send("User already exists");
    }

    const newUser = await prisma.user.create({
      data: {
        id: cuid(),
        email: parsedReq.email,
        password: parsedReq.password,
        phone: parsedReq.phone,
        type: "user",
      },
    });

    res.status(201).send("User created successfully");
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};

export const userSignin = async (req: CustomRequest, res: Response) => {
  try {
    const parsedReq = await userMinSchema.parseAsync(req.body);

    const user = await prisma.user.findUnique({
      where: {
        email: parsedReq.email,
      },
    });
    if (!user) {
      return res.status(401).send("User does not exist");
    }

    if (user.password !== parsedReq.password) {
      return res.status(401).send("Invalid password");
    }

    jwt.sign(
      { email: parsedReq.email, userId: user.id, userType: user.type },
      secret,
      (error: Error | null, token: string | undefined) => {
        if (error) {
          return res.status(500).send(error);
        }
        res.status(200).send({ token });
      }
    );
  } catch (e) {
    console.log(e);
    res.status(500).send(e);
  }
};
