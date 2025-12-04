import settings from "./settings.js";
import { getAuthUser } from "../databases/authdb.js";
import { GraphQLError } from "graphql";

const limiterSettings = settings.rateLimiterSettings;
const getLimiterWindow = () =>
  Math.floor(Date.now() / limiterSettings.windowSizeInMillis);

export const rateLimiter = (authUser) => {
  const user = getAuthUser(authUser);
  if (!user) {
    throw new GraphQLError("Unauthorized", {
      extensions: {
        code: "UNAUTHORIZED",
        http: { status: 401 },
      },
    });
  }

  if (!user.rateLimiting) {
    user.rateLimiting = {
      window: getLimiterWindow(),
      requestCounter: 0,
    };
  }

  const currentWindow = getLimiterWindow();

  // New time window → reset counter
  if (user.rateLimiting.window !== currentWindow) {
    user.rateLimiting.window = currentWindow;
    user.rateLimiting.requestCounter = 0;
  }

  user.rateLimiting.requestCounter += 1;
  const remaining = limiterSettings.limit - user.rateLimiting.requestCounter;

  if (remaining < 0) {
    throw new GraphQLError("Too many requests", {
      extensions: {
        code: "RATE LIMIT EXCEEDED",
        http: { status: 429 },
      },
    });
  }

  return {
    user: authUser,
    rateLimit: {
      limit: limiterSettings.limit,
      remaining: Math.max(remaining, 0),
    },
  };
};
