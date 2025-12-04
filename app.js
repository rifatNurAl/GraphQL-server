import express from "express";
import { createServer } from "http";
import cors from "cors";
import { expressMiddleware } from "@as-integrations/express5";
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./typedefs.js";
import {resolvers} from "./resolvers.js";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { verifyToken } from "./middleware/verifytoken.js";
import { rateLimiter } from "./middleware/ratelimiter.js";
import { WebSocketServer } from "ws";
import { useServer } from "graphql-ws/use/ws";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import { fileURLToPath } from "url";
import path from "path";

export const startServer = async (port = 4000) => {
  const app = express();
  const httpServer = createServer(app);

  // WebSocket server for subscriptions
  const wsServer = new WebSocketServer({
    server: httpServer,
    path: "/graphql",
  });

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  const serverCleanup = useServer(
    {
      schema,
      onConnect: async (ctx) => {
        const token = ctx.connectionParams?.Authorization || "";
        const username = verifyToken(token);
        if (!username) {
          throw new Error("Unauthorized");
        }
        ctx.extra.user = username;
      },
    },
    wsServer
  );

  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              await serverCleanup.dispose();
            },
          };
        },
      },
    ],
  });

  await server.start();

  app.use(
    "/graphql",
    cors(),
    express.json(),
    expressMiddleware(server, {
      context: async ({ req }) => {
        const authHeader = req.headers.authorization || "";
        const username = verifyToken(authHeader);

        // apply rate limiting only if logged in
        if (username) {
          rateLimiter(username);
        }

        return { user: username };
      },
    })
  );

  return new Promise((resolve) => {
    httpServer.listen(port, () => {
      console.log(`Server ready at: http://localhost:${port}/graphql`);
      resolve({ app, httpServer, server });
    });
  });
};

const isMain = fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);

if (isMain) {
  startServer();
}
