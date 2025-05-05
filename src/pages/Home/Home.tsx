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
          .select("*, profiles(*)") // profile der postenden user
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
	}, [fetchLimit]);

  return (
    <>
      <Header
        headerTitle="sparkle"
        imgLeft=
        {<svg width="35" height="34" viewBox="0 0 35 34" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M18.398 1.36936C18.946 0.167986 20.7501 0.609407 20.6815 1.92809L20.2672 9.89533C20.2214 10.7767 21.113 11.4027 21.9264 11.0602L27.3101 8.79343C28.4459 8.31518 29.4757 9.65902 28.7184 10.6314L25.0488 15.3435C24.5623 15.9682 24.8058 16.8846 25.5381 17.1855L33.2776 20.3651C34.457 20.8497 34.1615 22.5969 32.8884 22.6667L25.8285 23.0536C24.9878 23.0997 24.4564 23.9766 24.8045 24.7432L27.9686 31.7097C28.5049 32.8903 27.0426 33.9613 26.0788 33.0939L19.1903 26.8942C18.7283 26.4784 18.0249 26.4856 17.5715 26.9107L11.2095 32.8751C10.3933 33.6402 9.06713 32.9666 9.2035 31.8563L10.1168 24.42C10.2013 23.7326 9.68625 23.1173 8.99472 23.0794L1.46516 22.6667C0.192041 22.5969 -0.103435 20.8497 1.07594 20.3651L8.87839 17.1596C9.59116 16.8668 9.84533 15.9864 9.3983 15.3587L3.51779 7.10208C2.77252 6.05567 3.97553 4.73017 5.08908 5.37081L13.0458 9.9484C13.6571 10.3001 14.4384 10.0495 14.7311 9.40785L18.398 1.36936Z" fill="currentColor"/></svg>}
        imgLeftColor="text-main"
        iconsRight={[
          {
            name: <svg width="16" height="27" viewBox="0 0 16 27" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7.06576 2.88946C7.11781 2.46976 7.72616 2.46976 7.77822 2.88946L8.40984 7.98196C8.62141 9.68775 9.73144 11.1491 11.318 11.8105L13.8064 12.8479C14.1009 12.9706 14.1009 13.3878 13.8064 13.5105L11.318 14.5479C9.73144 15.2093 8.62141 16.6706 8.40984 18.3764L7.77822 23.4689C7.72616 23.8886 7.11781 23.8886 7.06576 23.4689L6.43414 18.3764C6.22257 16.6706 5.11254 15.2093 3.52602 14.5479L1.03757 13.5105C0.743116 13.3878 0.743116 12.9706 1.03757 12.8479L3.52602 11.8105C5.11254 11.1491 6.22257 9.68775 6.43414 7.98196L7.06576 2.88946Z" fill="currentColor"/>
          <path d="M12.5686 16.4671C12.6007 16.1841 13.0119 16.1841 13.0441 16.4671L13.2839 18.5766C13.3314 18.9944 13.5947 19.3566 13.9775 19.5306L15.3187 20.1406C15.5056 20.2256 15.5056 20.4912 15.3187 20.5762L13.9775 21.1862C13.5947 21.3602 13.3314 21.7224 13.2839 22.1402L13.0441 24.2497C13.0119 24.5327 12.6007 24.5327 12.5686 24.2497L12.3287 22.1402C12.2812 21.7224 12.0179 21.3602 11.6352 21.1862L10.294 20.5762C10.107 20.4912 10.107 20.2256 10.294 20.1406L11.6352 19.5306C12.0179 19.3566 12.2812 18.9944 12.3287 18.5766L12.5686 16.4671Z" fill="currentColor"/>
          </svg>,
            onClick: () => (window.location.pathname = "/favorites"),
  
          },
          {
            name: <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_4808_3665)">
            <path d="M15.1649 10.9963H15.1742" stroke="currentColor" stroke-width="1.7948" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M10.9675 10.9963H10.9769" stroke="currentColor" stroke-width="1.7948" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6.77014 10.9963H6.7795" stroke="currentColor" stroke-width="1.7948" stroke-linecap="round" stroke-linejoin="round"/><path d="M2.74896 16.1882C0.0015253 11.539 1.54316 5.54292 6.19229 2.79549C10.8414 0.0480528 16.8375 1.58968 19.585 6.23882C22.3324 10.888 20.7908 16.8841 16.1416 19.6315C13.7323 21.0553 10.9612 21.3272 8.46799 20.6117" stroke="currentColor" stroke-width="1.19653" stroke-linecap="round"/></g><defs><clipPath id="clip0_4808_3665"><rect width="21.5376" height="21.5376" fill="white" transform="translate(0.271667 0.213867)"/></clipPath></defs></svg>
            ,
            onClick: () => setIsSettingsOpen(true),
          },
        ]}
        iconsRightHeight="h-7"
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
