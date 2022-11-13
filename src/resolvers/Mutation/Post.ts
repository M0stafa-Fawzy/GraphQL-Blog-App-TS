import { Post } from "@prisma/client";
import { Context } from "../../index";
import { authorizeUser } from "../../utilis/auth";

interface PostArgs {
    post: {
        title?: string;
        content?: string;
    }
}

interface PostPayloadType {
    userErrors: {
        message: string
    }[],
    post: Post | null
}

const Post = {
    postCreate: async (parent: any, { post }: PostArgs, { prisma, info }: Context): Promise<PostPayloadType> => {
        if (!info) {
            return {
                userErrors: [{
                    message: "please log in"
                }],
                post: null
            }
        }
        const { id } = info
        const { title, content } = post

        if (!title || !content) {
            return {
                userErrors: [{
                    message: "no title or content provided"
                }],
                post: null
            }
        }

        const createdpost = await prisma.post.create({
            data: {
                title,
                content,
                userId: id
            }
        })

        return {
            userErrors: [],
            post: createdpost
        };
    },
    postUpdate: async (parent: any, { id, post }: { id: string, post: PostArgs["post"] }, { prisma, info }: Context): Promise<PostPayloadType> => {

        if (!info) {
            return {
                userErrors: [{
                    message: "unauthorized please login"
                }],
                post: null
            }
        }

        const error = await authorizeUser({
            userId: info.id,
            postId: Number(id),
            prisma
        })

        if (error) {
            return {
                userErrors: [{
                    message: error
                }],
                post: null
            }
        }

        const { title, content } = post
        if (!title && !content) {
            return {
                userErrors: [{
                    message: "no title or content provided"
                }],
                post: null
            }
        }

        const exist = await prisma.post.findUnique({
            where: {
                id: Number(id)
            }
        })
        if (!exist) {
            return {
                userErrors: [{
                    message: "post not found"
                }],
                post: null
            }
        }

        const updateData = {
            title,
            content
        }

        if (!updateData.title) delete updateData.title
        if (!updateData.content) delete updateData.content

        const updatedpost = await prisma.post.update({
            data: {
                ...updateData
            },
            where: {
                id: Number(id)
            }
        })

        return {
            userErrors: [],
            post: updatedpost
        }

    },
    postDelete: async (parent: any, { id }: { id: string }, { prisma, info }: Context): Promise<PostPayloadType> => {

        if (!info) {
            return {
                userErrors: [{
                    message: "unauthorized please login"
                }],
                post: null
            }
        }

        const error = await authorizeUser({
            userId: info.id,
            postId: Number(id),
            prisma
        })

        if (error) {
            return {
                userErrors: [{
                    message: error
                }],
                post: null
            }
        }

        if (!id) {
            return {
                userErrors: [{
                    message: "post id not provided"
                }],
                post: null
            }
        }

        const post = await prisma.post.findUnique({
            where: {
                id: Number(id)
            }
        })
        if (!post) {
            return {
                userErrors: [{
                    message: "post not found"
                }],
                post: null
            }
        }

        await prisma.post.delete({
            where: {
                id: Number(id)
            }
        })
        return {
            userErrors: [],
            post
        }
    },
    postEditStatus: async (parent: any, { id, publish }: { id: string, publish: boolean }, { prisma, info }: Context): Promise<PostPayloadType> => {
        if (!info) {
            return {
                userErrors: [{
                    message: "please login first"
                }],
                post: null
            }
        }

        const error = await authorizeUser({
            userId: info.id,
            postId: Number(id),
            prisma
        })
        if (error) {
            return {
                userErrors: [{
                    message: error
                }],
                post: null
            }
        }

        const post = await prisma.post.update({
            data: {
                publish
            },
            where: {
                id: Number(id)
            }
        })
        return {
            userErrors: [],
            post
        }
    }
}

export { Post }

