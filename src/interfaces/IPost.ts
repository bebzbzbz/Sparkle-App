import IUser from "./IUser";

export default interface IPost {
  id: string;
  user_id: string;
  post_desc: string;
  post_media_url: string;
  media_type: "image" | "video";
  location: string | null;
  created_at: string;
  updated_at: string;
  social_sharing?: {
    facebook: boolean;
    twitter: boolean;
    instagram: boolean;
    tiktok: boolean;
    tumblr: boolean;
    bluesky: boolean;
  };
  profiles: IUser
}
