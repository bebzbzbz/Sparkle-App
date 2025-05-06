import { useContext, useEffect, useState } from "react";
import IUser from "../../interfaces/IUser";
import supabase from "../../utils/supabase";
import { mainContext } from "../../context/MainProvider";

interface ProfileInfoProps {
  profile: IUser;
  refresh?: boolean;
}

const ProfileInfo = ({ profile, refresh }: ProfileInfoProps) => {
  const [numberOfPosts, setNumberOfPosts] = useState<number>(0);
  const [numberOfFollowers, setNumberOfFollowers] = useState<number>(0);
  const [numberOfFollowing, setNumberOfFollowing] = useState<number>(0);

  const {timelineFeed, setTimelineFeed} = useContext(mainContext)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: posts } = await supabase
          .from("posts")
          .select("*")
          .eq("user_id", profile.id);
        const { count: followers } = await supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("following_id", profile.id);
        const { count: following } = await supabase
          .from("follows")
          .select("*", { count: "exact", head: true })
          .eq("follower_id", profile.id);

        if (posts) {
          setNumberOfPosts(posts.length);
        }
        if (followers) {
          setNumberOfFollowers(followers || 0);
        }
        if (following) {
          setNumberOfFollowing(following || 0);
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [profile.id, refresh]);

  return (
    <article>
      {/* hier kommen username, profession, profile_desc und website rein */}
      <div className="grid grid-cols-[1fr_2fr] items-center gap-5 mb-2">
        <img
          className="w-full aspect-square object-cover rounded-xl transition ease-in-out hover:drop-shadow-xl hover:opacity-90"
          src={profile?.profile_image_url || `/svg/pic-empty.svg`}
          alt={profile?.username}
        />
        <div className="flex flex-col">
          <p className="text-2xl font-bold">
            {profile?.profile_name || "Anonymous"}
          </p>
          {profile?.profession && (
            <p className="text-lg font-light">{profile?.profession}</p>
          )}
          {profile?.profile_desc && (
            <p className="text-sm font-extralight">
              {profile?.profile_desc}
            </p>
          )}
          {profile?.website && (
            <a
<<<<<<< HEAD
              className="cursor-pointer text-main font-bold h-5 w-5 mt-1"
=======
              className="cursor-pointer text-sm text-main font-bold"
>>>>>>> 41bb4b8bcefb12cb8dca3752fdebad1d6bec8577
              href={profile?.website}
              target="_blank"
            >
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 4.71053C6.78024 5.42105 8.38755 7.36316 8.57481 9.44737C8.70011 10.8421 9.39473 12.0496 10.5 12.631C10.9386 12.8618 11.4419 12.9939 12 13C12.7549 13.0082 13.5183 12.4629 13.5164 11.708C13.5158 11.4745 13.4773 11.2358 13.417 11.0163C13.3331 10.7108 13.3257 10.3595 13.5 10C14.1099 8.74254 15.3094 8.40477 16.2599 7.72186C16.6814 7.41898 17.0659 7.09947 17.2355 6.84211C17.7037 6.13158 18.1718 4.71053 17.9377 4" stroke="currentColor" stroke-width="1.5"/><path d="M22 13C21.6706 13.931 21.4375 16.375 17.7182 16.4138C17.7182 16.4138 16.9248 16.4138 16 16.6339M13.4365 18.2759C12.646 19.7655 13.1071 21.3793 13.4365 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M7 20.6622C8.47087 21.513 10.1786 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 13.8214 2.48697 15.5291 3.33782 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>
            </a>
          )}
        </div>
      </div>
      <div className="grid grid-cols-[1fr_2fr] items-center gap-3">
        <div className="flex gap-4 h-5 justify-center items-center  text-main">
          {/* mit den icons wird die ansicht der beiträge an- und abgewählt */}
          <div
          className="h-full" 
          onClick={() => setTimelineFeed(false)}>
              {!timelineFeed 
              ? <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M2.02659 0.333496H4.27992C5.21992 0.333496 5.97325 1.10016 5.97325 2.04083V4.3135C5.97325 5.26016 5.21992 6.02016 4.27992 6.02016H2.02659C1.09325 6.02016 0.333252 5.26016 0.333252 4.3135V2.04083C0.333252 1.10016 1.09325 0.333496 2.02659 0.333496ZM2.02659 7.97996H4.27992C5.21992 7.97996 5.97325 8.74063 5.97325 9.6873V11.96C5.97325 12.9 5.21992 13.6666 4.27992 13.6666H2.02659C1.09325 13.6666 0.333252 12.9 0.333252 11.96V9.6873C0.333252 8.74063 1.09325 7.97996 2.02659 7.97996ZM11.9733 0.333496H9.71999C8.77999 0.333496 8.02665 1.10016 8.02665 2.04083V4.3135C8.02665 5.26016 8.77999 6.02016 9.71999 6.02016H11.9733C12.9067 6.02016 13.6667 5.26016 13.6667 4.3135V2.04083C13.6667 1.10016 12.9067 0.333496 11.9733 0.333496ZM9.71999 7.97996H11.9733C12.9067 7.97996 13.6667 8.74063 13.6667 9.6873V11.96C13.6667 12.9 12.9067 13.6666 11.9733 13.6666H9.71999C8.77999 13.6666 8.02665 12.9 8.02665 11.96V9.6873C8.02665 8.74063 8.77999 7.97996 9.71999 7.97996Z" fill="currentColor"/>
              </svg>
              : <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.9729 10.6868L7.4729 10.6868L7.4729 10.6867L6.9729 10.6868ZM6.9729 12.9602L7.4729 12.9603V12.9602H6.9729ZM1.33325 12.9602L0.833252 12.9602L0.833252 12.9603L1.33325 12.9602ZM1.33325 10.6868L0.833252 10.6867V10.6868H1.33325ZM14.6663 10.6868L15.1663 10.6868L15.1663 10.6867L14.6663 10.6868ZM14.6663 12.9602L15.1663 12.9603V12.9602H14.6663ZM10.72 14.6663L10.72 15.1663H10.72V14.6663ZM9.02661 12.9602L8.52661 12.9602L8.52661 12.9603L9.02661 12.9602ZM9.02661 10.6868L8.52661 10.6867V10.6868H9.02661ZM10.72 8.97974L10.72 8.47974L10.72 8.47974L10.72 8.97974ZM6.9729 3.04028L7.4729 3.04028L7.4729 3.0402L6.9729 3.04028ZM6.9729 5.31372L7.4729 5.31385V5.31372H6.9729ZM1.33325 5.31372L0.833252 5.31372L0.833252 5.31385L1.33325 5.31372ZM1.33325 3.04028L0.833252 3.0402V3.04028H1.33325ZM14.6663 3.04028L15.1663 3.04028L15.1663 3.0402L14.6663 3.04028ZM14.6663 5.31372L15.1663 5.31385V5.31372H14.6663ZM10.72 7.01978L10.72 7.51978H10.72V7.01978ZM9.02661 5.31372L8.52661 5.31372L8.52661 5.31385L9.02661 5.31372ZM9.02661 3.04028L8.52661 3.0402V3.04028H9.02661ZM10.72 1.33325L10.72 0.833252L10.72 0.833252L10.72 1.33325ZM5.27954 8.97974V9.47974C5.93927 9.47974 6.47279 10.0123 6.4729 10.6868L6.9729 10.6868L7.4729 10.6867C7.47271 9.46813 6.49963 8.47974 5.27954 8.47974V8.97974ZM6.9729 10.6868H6.4729V12.9602H6.9729H7.4729V10.6868H6.9729ZM6.9729 12.9602L6.4729 12.9601C6.47272 13.6288 5.93825 14.1663 5.27954 14.1663V14.6663V15.1663C6.50051 15.1663 7.47257 14.1711 7.4729 12.9603L6.9729 12.9602ZM5.27954 14.6663V14.1663H3.02661V14.6663V15.1663H5.27954V14.6663ZM3.02661 14.6663V14.1663C2.3733 14.1663 1.83344 13.6275 1.83325 12.9601L1.33325 12.9602L0.833252 12.9603C0.83359 14.1724 1.81358 15.1663 3.02661 15.1663V14.6663ZM1.33325 12.9602H1.83325V10.6868H1.33325H0.833252V12.9602H1.33325ZM1.33325 10.6868L1.83325 10.6868C1.83336 10.0136 2.37227 9.47974 3.02661 9.47974V8.97974V8.47974C1.81447 8.47974 0.833448 9.46684 0.833252 10.6867L1.33325 10.6868ZM3.02661 8.97974V9.47974H5.27954V8.97974V8.47974H3.02661V8.97974ZM12.9729 8.97974V9.47974C13.6272 9.47974 14.1662 10.0136 14.1663 10.6868L14.6663 10.6868L15.1663 10.6867C15.1661 9.46684 14.185 8.47974 12.9729 8.47974V8.97974ZM14.6663 10.6868H14.1663V12.9602H14.6663H15.1663V10.6868H14.6663ZM14.6663 12.9602L14.1663 12.9601C14.1661 13.6275 13.6262 14.1663 12.9729 14.1663V14.6663V15.1663C14.1859 15.1663 15.1659 14.1724 15.1663 12.9603L14.6663 12.9602ZM12.9729 14.6663V14.1663H10.72V14.6663V15.1663H12.9729V14.6663ZM10.72 14.6663L10.72 14.1663C10.0613 14.1663 9.5268 13.6288 9.52661 12.9601L9.02661 12.9602L8.52661 12.9603C8.52695 14.1711 9.49901 15.1662 10.72 15.1663L10.72 14.6663ZM9.02661 12.9602H9.52661V10.6868H9.02661H8.52661V12.9602H9.02661ZM9.02661 10.6868L9.52661 10.6868C9.52672 10.0123 10.0602 9.47974 10.72 9.47974L10.72 8.97974L10.72 8.47974C9.49989 8.47975 8.52681 9.46813 8.52661 10.6867L9.02661 10.6868ZM10.72 8.97974V9.47974H12.9729V8.97974V8.47974H10.72V8.97974ZM5.27954 1.33325V1.83325C5.93812 1.83325 6.47279 2.3707 6.4729 3.04037L6.9729 3.04028L7.4729 3.0402C7.47269 1.8288 6.50076 0.833252 5.27954 0.833252V1.33325ZM6.9729 3.04028H6.4729V5.31372H6.9729H7.4729V3.04028H6.9729ZM6.9729 5.31372L6.4729 5.31359C6.47272 5.98773 5.93953 6.51978 5.27954 6.51978V7.01978V7.51978C6.49925 7.51978 7.47258 6.53261 7.4729 5.31385L6.9729 5.31372ZM5.27954 7.01978V6.51978H3.02661V7.01978V7.51978H5.27954V7.01978ZM3.02661 7.01978V6.51978C2.37202 6.51978 1.83343 5.98645 1.83325 5.31359L1.33325 5.31372L0.833252 5.31385C0.833575 6.53389 1.81485 7.51978 3.02661 7.51978V7.01978ZM1.33325 5.31372H1.83325V3.04028H1.33325H0.833252V5.31372H1.33325ZM1.33325 3.04028L1.83325 3.04037C1.83337 2.37199 2.37343 1.83325 3.02661 1.83325V1.33325V0.833252C1.81333 0.833252 0.833462 1.82752 0.833252 3.0402L1.33325 3.04028ZM3.02661 1.33325V1.83325H5.27954V1.33325V0.833252H3.02661V1.33325ZM12.9729 1.33325V1.83325C13.6261 1.83325 14.1661 2.37199 14.1663 3.04037L14.6663 3.04028L15.1663 3.0402C15.166 1.82752 14.1862 0.833252 12.9729 0.833252V1.33325ZM14.6663 3.04028H14.1663V5.31372H14.6663H15.1663V3.04028H14.6663ZM14.6663 5.31372L14.1663 5.31359C14.1661 5.98645 13.6275 6.51978 12.9729 6.51978V7.01978V7.51978C14.1847 7.51978 15.1659 6.53389 15.1663 5.31385L14.6663 5.31372ZM12.9729 7.01978V6.51978H10.72V7.01978V7.51978H12.9729V7.01978ZM10.72 7.01978L10.72 6.51978C10.06 6.51977 9.52679 5.98772 9.52661 5.31359L9.02661 5.31372L8.52661 5.31385C8.52693 6.53261 9.50028 7.51977 10.72 7.51978L10.72 7.01978ZM9.02661 5.31372H9.52661V3.04028H9.02661H8.52661V5.31372H9.02661ZM9.02661 3.04028L9.52661 3.04037C9.52673 2.37071 10.0614 1.83326 10.72 1.83325L10.72 1.33325L10.72 0.833252C9.49876 0.833262 8.52682 1.82881 8.52661 3.0402L9.02661 3.04028ZM10.72 1.33325V1.83325H12.9729V1.33325V0.833252H10.72V1.33325Z" fill="currentColor"/></svg>
              }
          </div>
        <div           
        className="h-full" 
        onClick={() => setTimelineFeed(true)}>
            {timelineFeed 
            ? <svg viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="13" height="3.25" rx="1.625" fill="currentColor"/>
            <rect y="4.875" width="13" height="3.25" rx="1.625" fill="currentColor"/>
            <rect y="10" width="13" height="3" rx="1.5" fill="currentColor"/>
            </svg> : <svg viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0.5" y="0.5" width="12" height="2.25" rx="1.125" stroke="currentColor"/><rect x="0.5" y="5.375" width="12" height="2.25" rx="1.125" stroke="currentColor"/><rect x="0.5" y="10.5" width="12" height="2" rx="1" stroke="currentColor"/></svg>}
        </div>
      </div>
        {/* hier kommen anzahl von posts, followers und following rein */}
        <div className="grid grid-cols-3 items-center gap-5 pr-5">
          <div className="flex flex-col gap-1 items-center justify-center">
            <p className="text-2xl font-bold">{numberOfPosts}</p>
            <p className="text-sm font-extralight">Posts</p>
          </div>
          <div className="flex flex-col gap-1 items-center justify-center">
            <p className="text-2xl font-bold">{numberOfFollowers}</p>
            <p className="text-sm font-extralight">Followers</p>
          </div>
          <div className="flex flex-col gap-1 items-center justify-center">
            <p className="text-2xl font-bold">{numberOfFollowing}</p>
            <p className="text-sm font-extralight">Following</p>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProfileInfo;
