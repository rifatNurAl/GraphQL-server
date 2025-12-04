import test from "node:test";
import assert from "node:assert";
import jwt from "jsonwebtoken";

import { verifyToken } from "../middleware/verifytoken.js";

// user "pl" exists in authdb.js
test("returns username when token is valid and user exists", () => {
  const token = jwt.sign({ username: "pl" }, "my_secret_key");
  const authHeader = `Bearer ${token}`;

  const result = verifyToken(authHeader);

  assert.strictEqual(result, "pl");
});

test("returns null when Authorization header is missing", () => {
  const result = verifyToken(null);
  assert.strictEqual(result, null);
});

test("returns null when token is malformed", () => {
  const authHeader = "Bearer this.is.not.valid";
  const result = verifyToken(authHeader);
  assert.strictEqual(result, null);
});

// expired token
test("returns null for expired token", () => {
  const token = jwt.sign({ username: "pl" }, "my_secret_key", {
    expiresIn: -1,
  });
  const authHeader = `Bearer ${token}`;

  const result = verifyToken(authHeader);

  assert.strictEqual(result, null);
});
