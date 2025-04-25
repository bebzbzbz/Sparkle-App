interface IUser {
    id: string,
    username: string,
    profile_name: string,
    email: string,
    profile_image_url: string,
    profession?: string,
    birthday: Date,
    phone_number: string,
    gender: string,
    website?: string,
    profile_desc: string,
    created_at: string,
    updated_at: string
}

export default IUser