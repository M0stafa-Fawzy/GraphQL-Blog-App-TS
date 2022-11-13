import { Context } from './../index';

interface UserParentType {
    id: number
}

const User = {
    posts: (parent: UserParentType, args: any, { prisma, info }: Context) => {
        const isOwnProfile = parent.id === info?.id

        if (isOwnProfile) {
            return prisma.post.findMany({
                where: {
                    userId: parent.id
                }
            })
        } else {
            return prisma.post.findMany({
                where: {
                    userId: parent.id,
                    publish: true
                }
            })
        }
    }
}

export { User }