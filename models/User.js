import { encryptPassword } from "../utils/authUtils.js";
import { generateUniqueId } from "../utils/uidUtils.js";

export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
};

export const USERS = [
  {
    _id: generateUniqueId(),
    role: USER_ROLES.ADMIN,
    name: "Admin",
    email: "admin@gmail.com",
    password: await encryptPassword("password"),
  },
];
