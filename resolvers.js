import { pubsub } from "./pubsub.js";
import {
  getUsers,
  getUserById,
  createUser,
  getUserDataMap,
} from "./databases/db.js";
import { getAuthUser } from "./databases/authdb.js";
import jwt from "jsonwebtoken";

export const resolvers = {
  Subscription: {
    dataAdded: {
      subscribe: () => pubsub.asyncIterator(["DATA_ADDED"]),
    },
  },

  Query: {
    getAllData: (parent, args, context) => {
      if (!context.user) {
        throw new Error("Unauthorized access");
      }
      return getUsers();
    },

    getDataById: (parent, { id }) => {
      return getUserById(id);
    },

    me: (parent, args, context) => {
      if (!context.user) return null;
      return { username: context.user };
    },
  },

  User: {
    userOwnData: (parent) => {
      const ids = getUserDataMap(parent.username);
      if (!ids) return [];
      const all = getUsers();
      return all.filter((p) => ids.includes(p.id));
    },
  },

  Mutation: {
    addData: (parent, args) => {
      const newUser = createUser({
        id: args.id,
        forename: args.forename,
        surname: args.surname,
      });

      pubsub.publish("DATA_ADDED", { dataAdded: newUser });
      return newUser;
    },

    login: (parent, { username, password }) => {
      const user = getAuthUser(username);

      if (user && user.password === password) {
        const token = jwt.sign({ username }, "my_secret_key", {
          expiresIn: "3d",
        });

        return {
          username,
          access_token: token,
          token_type: "Bearer",
          expires_in: "3d",
        };
      }

      throw new Error("Unauthorized");
    },
  },
};
