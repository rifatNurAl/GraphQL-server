export const typeDefs = `
  """
  Authentication payload returned after a successful login.
  Contains the JWT token and related metadata.
  """
  type AuthPayload {
    "The access token generated for the user"
    access_token: String!
    "The username used for login"
    username: String!
    "The needed Bearer token"
    token_type: String!
    "Time until the token expires"
    expires_in: String!
  }

  """
  Single data record (equivalent to one REST /data item).
  """
  type Data {
    id: ID!
    forename: String!
    surname: String!
  }

  """
  Logged in user (only used for exposing user’s own data).
  """
  type User {
    username: String!
    userOwnData: [Data!]!
  }

  type Query {
    # Return all Data entries (requires valid token)
    getAllData: [Data!]!

    # Return one Data entry by id
    getDataById(id: ID!): Data

    # Currently authenticated user (if any)
    me: User
  }

  type Mutation {
    # Create a new Data entry
    addData(
      id: ID!
      forename: String!
      surname: String!
    ): Data

    # Perform login and return JWT and metadata
    login(username: String!, password: String!): AuthPayload
  }

  type Subscription {
    # Fired whenever a new Data item is added
    dataAdded: Data!
  }
`;
