import { Post } from "./Post"
import { Auth } from "./auth"

const Mutation = {
    ...Post,
    ...Auth,
};

export { Mutation };
