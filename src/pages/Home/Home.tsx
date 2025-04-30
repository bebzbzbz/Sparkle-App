import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import SinglePost from "../../components/SinglePost/SinglePost";
import supabase from "../../utils/supabase";
import PopUpSettings from "../../components/PopUpSettings/PopUpSettings";
import IPost from "../../interfaces/IPost";
import MainButton from "../../components/MainButton/MainButton";

const Home = () => {
  const [posts, setPosts] = useState<IPost[]>();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [fetchLimit, setFetchLimit] = useState<number>(5)

  // fetch posts
  const fetchPostsData = async () => {
    try {
      const { data } = await supabase.from("posts").select("*").limit(fetchLimit).order('created_at', { ascending: false });
      // Fallback-Logik für alte Daten
      const postsWithFallback = (data as any[])
        .map((post) => {
          let mediaUrl = post.post_media_url || "";
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
  }, [fetchLimit]);

  return (
    <>
      <Header
        headerTitle="WhoCares"
        imgLeft="logo"
        iconsRight={[
          {
            name: "heart",
            onClick: () => (window.location.pathname = "/favorites"),
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
      <section className="flex flex-col gap-11">
        {posts?.map((post: IPost) => {
          return (
            <div key={crypto.randomUUID()}>
              <SinglePost post={post} />
            </div>
          );
        })}
        <MainButton textContent="Load more posts" type="button" onClick={() => setFetchLimit((prev) => prev + 5)}/>
      </section>
    </>
  );
};

export default Home;
