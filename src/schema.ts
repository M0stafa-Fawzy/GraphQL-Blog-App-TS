import { gql } from "apollo-server";

const typeDefs = gql`
  type Query {
    me: User!
    profile(id: ID!): Profile!
    posts: [Post!]!
  }

  type Mutation {
    postCreate(post: PostInput!): PostPayload!
    postUpdate(id: ID!, post: PostInput!): PostPayload!
    postDelete(id: ID!): PostPayload!
    signup(name: String!, data: AuthInput!, bio: String!): AuthPayload!
    signin(data: AuthInput!): AuthPayload!
    postEditStatus(id: ID!, publish: Boolean!): PostPayload!
  }

  type User {
    id: ID!
    name: String
    email: String!
    posts: [Post!]!
  }

  type Post {
    id: ID!
    title: String!
    content: String!
    published: Boolean!
    createdAt: String!
    user: User!
  }

  type Profile {
    id: ID!
    bio: String!
    user: User!
  }

  type UserError {
    message: String!
  }

  type PostPayload {
    userErrors: [UserError!]!
    post: Post
  }

  type AuthPayload {
    userErrors: [UserError!]!
    token: String
  }

  input PostInput {
    title: String
    content: String
  }

  input AuthInput {
    email: String!
    password: String!
  }
`;

export default typeDefs;
