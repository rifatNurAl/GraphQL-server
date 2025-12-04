import jwt from "jsonwebtoken";
import { userExist } from "../databases/authdb.js";

// Parses "Bearer <token>" and returns username or null
export const verifyToken = (authToken) => {
  try {
    if (!authToken || !authToken.startsWith("Bearer ")) {
      return null;
    }

    const token = authToken.substring(7);
    if (!token) return null;

    const decodedToken = jwt.verify(token, "my_secret_key");

    if (!userExist(decodedToken.username)) {
      return null;
    }

    return decodedToken.username;
  } catch (err) {
    // invalid, expired, malformed token
    return null;
  }
};