import { useEffect, useState } from "react";
import MainButton from "../../components/MainButton/MainButton";
import MiniFeed from "../../components/MiniFeed/MiniFeed";
import ProfileInfo from "../../components/ProfileInfo/ProfileInfo";
import IUser from "../../interfaces/IUser";
import Header from "../../components/Header/Header";
import { useNavigate, useParams } from "react-router-dom";
import supabase from "../../utils/supabase";
import { useAuth } from "../../context/MainProvider";

const CommunityProfile = () => {
  const { userParam } = useParams();
  const { loggedInUser } = useAuth();
  const [communityProfile, setCommunityProfile] = useState<IUser | null>(null);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [loadingFollow, setLoadingFollow] = useState<boolean>(false);
  const [refreshProfileInfo, setRefreshProfileInfo] = useState(false);

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

  const navigate = useNavigate();

  if (communityProfile === null) {
    return (
      <section>
        <h2 className="text-center">Loading profile...</h2>
      </section>
    );
  } else {
    return (
      <section className="flex flex-col gap-5">
        <Header
          headerTitle={communityProfile?.username || ""}
          imgLeft="arrow-back"
          leftAction={() => navigate(-1)}
          iconsRight={[{ name: "options", onClick: () => {}, alt: "Optionen" }]}
        />
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
        <MiniFeed profile={communityProfile} />
      </section>
    );
  }
};

export default CommunityProfile;
