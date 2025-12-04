import test from "node:test";
import assert from "node:assert";
import { server } from "../apidefs.js";
import fs from "node:fs";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test("login returns a token for valid user", async () => {
  await server.start();

  const query = `
    mutation ($username: String!, $password: String!) {
      login(username: $username, password: $password) {
        username
        access_token
        token_type
        expires_in
      }
    }
  `;

  const response = await server.executeOperation({
    query,
    variables: { username: "pl", password: "pass" },
  });

  const result = response.body.singleResult.data.login;

  assert.equal(result.username, "pl");
  assert.ok(result.access_token);
  assert.equal(result.token_type, "Bearer");
  assert.equal(result.expires_in, "3d");

  fs.writeFileSync(
    path.join(__dirname, "token.json"),
    JSON.stringify({ token: result.access_token }),
    { flag: "w" }
  );

  await server.stop();
});
