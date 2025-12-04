# GraphQL API – Final Assignment

## Overview

This project implements a fully functional **GraphQL server** that mirrors the operations from the earlier REST API assignment. It provides CRUD functionality for user data, authentication via JWT, input validation, and automated tests using Node’s built-in `node:test` module.

The project includes:

- GraphQL schema (typedefs)
- Resolvers for all operations
- JWT-based authentication
- Automated test suite
- Full GraphQL documentation

This fulfills all assignment requirements:

- Convert REST API operations to GraphQL
- Add documentation
- Add automated tests
- Publish on GitHub

## Technologies Used

- Node.js (ES Modules)
- Apollo Server (`@apollo/server`)
- GraphQL
- JSON Web Tokens (`jsonwebtoken`)
- Node’s built-in test runner (`node:test`)
- WebSocket (`ws`)

## GraphQL Schema Documentation

```graphql
type User {
  id: ID!
  firstname: String!
  lastname: String!
}

type LoginResponse {
  username: String!
  access_token: String!
  token_type: String!
  expires_in: String!
}

type Query {
  users: [User!]!
  user(id: ID!): User
  searchUsers(firstname: String!): [User!]!
  me: String
}

type Mutation {
  addUser(id: ID!, firstname: String!, lastname: String!): User
  updateUser(id: ID!, firstname: String, lastname: String): User
  deleteUser(id: ID!): User
  login(username: String!, password: String!): LoginResponse
}

## Authentication
Authorization: Bearer <token>

## Login

mutation {
  login(username: "pl", password: "pass") {
    username
    access_token
    token_type
    expires_in
  }
}



## Get all user

query {
  users {
    id
    firstname
    lastname
  }
}

## Add User
mutation {
  addUser(id: "3", firstname: "John", lastname: "Doe") {
    id
    firstname
    lastname
  }
}


## Update user
mutation {
  updateUser(id: "1", firstname: "UpdatedName") {
    id
    firstname
    lastname
  }
}

## Delete User

mutation {
  deleteUser(id: "2") {
    id
    firstname
    lastname
  }
}

