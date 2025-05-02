interface IComment {
    id: string,
    post_id: string,
    user_id: string,
    text_content: string,
    created_at: string,
    updated_at: string,
    username?: string,
    profile_image_url?: string
    profiles?: {
        username: string,
        id: string,
        profile_image_url: string;
    }
}

export default IComment;