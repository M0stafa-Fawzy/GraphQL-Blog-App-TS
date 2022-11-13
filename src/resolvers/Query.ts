import { Context } from '../index';
import { UserPayload } from "./Mutation/auth"
const Query = {
  me: async (parent: any, args: any, { prisma, info }: Context) => {
    if (!info) return null

    const { id } = info

    const user = await prisma.user.findUnique({
      where: {
        id
      }
    })
    return user
  },

  profile: async (parent: any, { id }: { id: string }, { prisma }: Context) => {
    return prisma.profile.findUnique({
      where: {
        userId: Number(id)
      }
    })
  },

  posts: async (parent: any, args: any, { prisma }: Context) => {
    const posts = await prisma.post.findMany({
      orderBy: [{
        createdAt: "desc"
      }]
    })
    return posts
  }
};

export { Query };
