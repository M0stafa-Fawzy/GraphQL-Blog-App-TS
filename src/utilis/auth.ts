import { Context } from './../index';
import jwt from "jsonwebtoken"

interface authorizeUserPayload {
    userId: number,
    postId: number,
    prisma: Context["prisma"]
}

const auth = (token: string): any => {
    try {
        const info = jwt.verify(token, "JWTSECRETKEYGRQPHQLDEVPROJECT")
        return info
    } catch (error) {
        return error
    }
}

const authorizeUser = async ({ userId, postId, prisma }: authorizeUserPayload) => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        }
    })
    if (!user) {
        return "user not found"
    }

    const post = await prisma.post.findUnique({
        where: {
            id: postId
        }
    })
    if (!user) {
        return "post not found"
    }

    if (post?.userId !== user.id) {
        return "unauthorized action"
    }
}

export { auth, authorizeUser }