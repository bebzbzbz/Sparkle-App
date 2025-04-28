interface IPost {
    id: string,
    user_id: string,
    post_desc: string,
    created_at: string,
    updated_at: string,
    location?: string,
    post_media_url?: string,
    media_type?: string
}

export default IPost