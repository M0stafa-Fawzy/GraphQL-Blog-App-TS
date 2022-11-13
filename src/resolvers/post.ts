import { Context } from './../index';
import { userLoader } from "../loaders/userLoader"

interface PostParentType {
    userId: number
}

const Post = {
    user: (parent: PostParentType, args: any, { prisma }: Context) => {
        return userLoader.load(parent.userId)
    }
}

export { Post }