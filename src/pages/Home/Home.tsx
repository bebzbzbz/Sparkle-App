import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import SinglePost from "../../components/SinglePost/SinglePost";
import supabase from "../../utils/supabase";
import PopUpSettings from "../../components/PopUpSettings/PopUpSettings";

export interface ISinglePost {
  id: string;
  user_id: string;
  post_desc: string;
  post_media_url: string;
  media_type: string;
  location?: string;
  created_at?: string;
  social_sharing?: object;
}

const Home = () => {
  const [posts, setPosts] = useState<ISinglePost[]>();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // fetch posts
  const fetchPostsData = async () => {
    try {
      const { data } = await supabase.from("posts").select("*").order('created_at', { ascending: false });
      // Fallback-Logik für alte Daten
      const postsWithFallback = (data as any[])
        .map((post) => {
          let mediaUrl = post.post_media_url || post.post_image_url || "";
          let mediaType = post.media_type;
          if (!mediaType && mediaUrl) {
            if (mediaUrl.match(/\.(jpg|jpeg|png|gif|webp)$/i))
              mediaType = "image";
            else if (mediaUrl.match(/\.(mp4|mov|webm|ogg)$/i))
              mediaType = "video";
          }
          return {
            ...post,
            post_media_url: mediaUrl,
            media_type: mediaType,
          };
        })
        .filter((post) => post.post_media_url && post.media_type);
      setPosts(postsWithFallback);
    } catch (error) {
      // Fehler beim Laden der Posts können hier ggf. geloggt werden
    }
  };
  // console.log("postsData:",posts)

  useEffect(() => {
    fetchPostsData();
  }, []);

  return (
    <>
      <Header
        headerTitle="WhoCares"
        imgLeft="logo"
        iconsRight={[
          {
            name: "heart",
            onClick: () => (window.location.pathname = "/profile/edit"),
            alt: "Edit",
          },
          {
            name: "newpost",
            onClick: () => (window.location.pathname = "/newpost"),
            alt: "Neuer Post",
          },
          {
            name: "options",
            onClick: () => setIsSettingsOpen(true),
            alt: "Settings",
          },
        ]}
      />
      <PopUpSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
      {posts?.map((post: ISinglePost) => {
        return (
          <div key={post.id}>
            <SinglePost post={post} postId={post.id} />
          </div>
        );
      })}
    </>
  );
};

export default Home;
