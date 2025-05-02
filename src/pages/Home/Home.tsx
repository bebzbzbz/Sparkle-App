import { useEffect, useState } from "react";
import Header from "../../components/Header/Header";
import SinglePost from "../../components/SinglePost/SinglePost";
import supabase from "../../utils/supabase";
import PopUpSettings from "../../components/PopUpSettings/PopUpSettings";
import IPost from "../../interfaces/IPost";
import MainButton from "../../components/MainButton/MainButton";
import { useAuth } from "../../context/MainProvider";

const Home = () => {
  const [posts, setPosts] = useState<IPost[]>();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [fetchLimit, setFetchLimit] = useState<number>(5)
  const {user} = useAuth()

  // fetch posts
  const fetchPostsData = async () => {
    try {
      // zuerst fetch für alle user, denen wir folgen
      const { data: followedUsers } = await supabase.from("follows").select("following_id").eq("follower_id", user?.id);

      if(followedUsers) {
        // map macht aus dem objekt array einen einfachen array mit nur den ids
        const followingIds = followedUsers.map((f) => f.following_id);
        // eigene id hineinpushen, damit wir auch auf der home page erscheinen
        followingIds.push(user?.id)

        // fetch der posts mithilfe der ids (.in für arrays)
        const { data: followedPosts, error } = await supabase
          .from("posts")
          .select("*, profiles(*)") // include post authors' profile info
          .in("user_id", followingIds)
          .limit(fetchLimit).order('created_at', { ascending: false });

          if(error) {
            console.error(error)
          } else {
            setPosts(followedPosts)
          }
      }
    } catch (error) {
      console.error(error)
    }
  };

	useEffect(() => {
		fetchPostsData();
	}, []);

  return (
    <>
      <Header
        headerTitle="Sparkle"
        imgLeft="logo"
        iconsRight={[
          {
            name: "heart",
            onClick: () => (window.location.pathname = "/favorites"),
            alt: "Edit",
          },
          // {
          //   name: "newpost",
          //   onClick: () => (window.location.pathname = "/newpost"),
          //   alt: "Neuer Post",
          // },
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
              <SinglePost post={post} userInfo={post.profiles} />
            </div>
          );
        })}
        <MainButton textContent="Load more posts" type="button" onClick={() => setFetchLimit((prev) => prev + 5)}/>
      </section>
    </>
  );
};

export default Home;
