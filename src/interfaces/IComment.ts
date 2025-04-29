interface IComment {
    id: string,
    post_id: string,
    user_id: string,
    text_content: string,
    created_at: string,
    updated_at: string,
    username?: string
}

export default IComment;