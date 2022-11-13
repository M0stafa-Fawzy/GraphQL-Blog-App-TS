import { Context } from "../../index";
import validator from "validator"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { User } from "@prisma/client";
// dotenv.config()
interface SignupArgss {
    name: string,
    data: {
        email: string,
        password: string
    }
    bio: string
}

export interface UserPayload {
    userErrors: {
        message: string
    }[]
    token: string | null
}
const Auth = {
    signup: async (parent: any, { name, data, bio }: SignupArgss, { prisma }: Context): Promise<UserPayload> => {
        const { email, password } = data
        if (!validator.isEmail(email) || !name || !bio) {
            return {
                userErrors: [{
                    message: "not a good email"
                }],
                token: null
            }
        }

        const hashedPass = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                name, email, password: hashedPass
            }
        })

        await prisma.profile.create({
            data: {
                bio,
                userId: user.id
            }
        })

        const token = jwt.sign({ id: user.id, email }, "JWTSECRETKEYGRQPHQLDEVPROJECT")
        return {
            userErrors: [],
            token
        }
    },
    signin: async (parent: any, { data }: SignupArgss, { prisma }: Context): Promise<UserPayload> => {
        const { email, password } = data

        const user = await prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) {
            return {
                userErrors: [{
                    message: "user does  not exist"
                }],
                token: null
            }
        }

        const verified = await bcrypt.compare(password, user.password)
        if (!verified) {
            return {
                userErrors: [{
                    message: "wrong password"
                }],
                token: null
            }
        }

        const token = jwt.sign({ id: user.id, email }, "JWTSECRETKEYGRQPHQLDEVPROJECT")
        return {
            userErrors: [],
            token
        }
    }
}

export { Auth }