import { ApolloServer } from "apollo-server";
import typeDefs from "./schema";
import { Query, Mutation, Profile, Post, User } from "./resolvers/index";
import { auth } from "./utilis/auth"
import { PrismaClient, Prisma } from "@prisma/client";

export const prisma = new PrismaClient();
export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  info: {
    id: number
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Profile,
    Post,
    User,
    Mutation,
  },
  context: ({ req }: any) => {
    const info = auth(req.headers.authorization)
    return {
      prisma,
      info
    }
  }
});

server.listen().then(({ url }) => {
  console.log("running on " + url);
});
