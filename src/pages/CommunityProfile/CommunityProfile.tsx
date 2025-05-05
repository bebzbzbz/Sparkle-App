import { useContext, useEffect, useState } from "react";
import MainButton from "../../components/MainButton/MainButton";
import MiniFeed from "../../components/MiniFeed/MiniFeed";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";
import IUser from "../../interfaces/IUser";
import Header from "../../components/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../../utils/supabase";
import { mainContext, useAuth } from "../../context/MainProvider";
import PostDetails from "../../components/PostDetails/PostDetails";

const CommunityProfile = () => {
  const { userParam } = useParams();
  const { loggedInUser } = useAuth();
  const [communityProfile, setCommunityProfile] = useState<IUser | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [loadingFollow, setLoadingFollow] = useState<boolean>(false);
  const [refreshProfileInfo, setRefreshProfileInfo] = useState(false);
  const {openModal} = useContext(mainContext)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // fetch der profile, die mit der id des users/des params übereinstimmen
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userParam);

        if (profile) {
          // der fetch gibt einen array zurück, deshalb müssen wir das erste objekt selektieren
          setCommunityProfile(profile[0] as unknown as IUser);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [userParam]);

  // Prüfen, ob ich dem Profil folge
  useEffect(() => {
    const checkFollow = async () => {
      if (!loggedInUser || !communityProfile) return;
      const { data } = await supabase
        .from("follows")
        .select("*")
        .eq("follower_id", loggedInUser.id)
        .eq("following_id", communityProfile.id)
        .single();
      setIsFollowing(!!data);
    };
    checkFollow();
  }, [loggedInUser, communityProfile]);

  const handleFollow = async () => {
    if (!loggedInUser || !communityProfile) return;
    setLoadingFollow(true);
    if (isFollowing) {
      // Unfollow
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", loggedInUser.id)
        .eq("following_id", communityProfile.id);
      setIsFollowing(false);
    } else {
      // Follow
      await supabase.from("follows").insert({
        follower_id: loggedInUser.id,
        following_id: communityProfile.id,
      });
      setIsFollowing(true);
    }
    setLoadingFollow(false);
    setRefreshProfileInfo((r) => !r);
  };

  if (communityProfile === null) {
    return (
      <section>
        <h2 className="text-center">Loading profile...</h2>
      </section>
    );
  } else {
    return (
      <>
        <Header
          headerTitle={communityProfile?.username || ""}
          imgLeft={<svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 1L1.24808 6.16795C0.654343 6.56377 0.654342 7.43623 1.24808 7.83205L9 13" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>}
          leftAction={() => navigate(-1)}
          imgLeftColor="text-main"
        />
        <section className="flex flex-col gap-5">
          <ProfileInfo profile={communityProfile} refresh={refreshProfileInfo} />
          {loggedInUser && loggedInUser.id !== communityProfile.id && (
            <MainButton
              textContent={isFollowing ? "Unfollow" : "Follow"}
              type="button"
              icon={isFollowing ? "unfollow" : "follow"}
              onClick={handleFollow}
              disabled={loadingFollow}
            />
          )}
          <MiniFeed profileId={communityProfile.id} />
          {openModal && <PostDetails/>}
        </section>
      </>
    );
  }
};

export default CommunityProfile;
