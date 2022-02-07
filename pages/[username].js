import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import { parseCookies } from "nookies";
import { NoProfile, NoProfilePosts } from "../components/Layout/NoData";
import cookie from "js-cookie";
import {Grid} from 'semantic-ui-react';
import ProfileMenuTabs from "../components/Profile/ProfileMenuTabs";
import ProfileHeader from "../components/Profile/ProfileHeader";
import CardPost from "../components/Post/CardPost";
import { PlaceHolderPosts } from "../components/Layout/PlaceHolderGroup";
import {PostDeleteToastr, Toastr} from '../components/Layout/Toastr';
import Followers from '../components/Profile/Followers';
import Following from '../components/Profile/Following';

export default function ProfilePage({
    errorLoading,
    profile,
    followersLength,
    followingLength,
    user,
    userFollowStats
}) {

    const router = useRouter();

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);

    const [activeItem, setActiveItem] = useState('profile')
    const handleItemClick = item =>setActiveItem(item);

    const [loggedUserFollowStats, setUserFollowStats] = useState(userFollowStats)

    const [showToastr, setShowToastr] = useState(false)

    const ownAccount = profile.user._id === user._id;

    if (errorLoading) return <NoProfile />;

    useEffect(() => {
        const getPosts = async () => {
          setLoading(true);
    
          try {
            const { username } = router.query;
            const res = await axios.get(`${baseUrl}/api/profile/posts/${username}`, {
              headers: { Authorization: cookie.get("token") }
            });
    
            setPosts(res.data);
          } catch (error) {
            alert("Error Loading Posts");
          }
    
          setLoading(false);
        };
        getPosts();
    }, [router.query.username]);

    useEffect(() => {
        showToastr && setTimeout(()=> setShowTastr(false), 3000)
    }, [showToastr])

    return (
        <>
        {showToastr && <PostDeleteToastr/>}
            <Grid stackable>
                <Grid.Row>
                    <Grid.Column>
                        <ProfileMenuTabs 
                            activeItem={activeItem} 
                            handleItemClick={handleItemClick} 
                            followersLength={followersLength} 
                            followingLength={followingLength}
                            ownAccount={ownAccount}
                            loggedUserFollowStats={loggedUserFollowStats}
                            />
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column>
                        {activeItem==='profile' &&
                            <>
                                <ProfileHeader profile={profile}
                                    ownAccount={ownAccount}
                                    loggedUserFollowStats={loggedUserFollowStats}
                                    setUserFollowStats={setUserFollowStats}
                                />

                                {loading ? (
                                    <PlaceHolderPosts />
                                    
                                ):( 
                                    posts.length>0 ?
                                    posts.map(post => (
                                        <CardPost 
                                            key={post._id}
                                            post={post}
                                            user={user}
                                            setPosts={setPosts}
                                            setShowToaster={setShowToastr}
                                    />
                                    )): <NoProfilePosts />
                                )}
                            </>
                        
                        }

                        {activeItem==='followers' && (
                            <Followers 
                                user={user}
                                loggedUserFollowStats={loggedUserFollowStats}
                                setUserFollowStats={setUserFollowStats}
                                profileUserId={profile.user._id}
                            />
                        )}

                        {activeItem==='following' && (
                            <Following 
                                user={user}
                                loggedUserFollowStats={loggedUserFollowStats}
                                setUserFollowStats={setUserFollowStats}
                                profileUserId={profile.user._id}
                            />
                        )}
                        
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        </>
    )
}

ProfilePage.getInitialProps = async ctx => {
    try {
      const { username } = ctx.query;
      const { token } = parseCookies(ctx);
  
      const res = await axios.get(`${baseUrl}/api/profile/${username}`, {
        headers: { Authorization: token }
      });
  
      const { profile, followersLength, followingLength } = res.data;
  
      return { profile, followersLength, followingLength };
    } catch (error) {
      return { errorLoading: true };
    }
};