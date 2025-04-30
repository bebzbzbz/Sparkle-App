import IPost from "./IPost";

interface ILikedPost {
    created_at: string,
    id: string,
    post_id: string,
    user_id: string,
    posts: IPost
}

export default ILikedPost