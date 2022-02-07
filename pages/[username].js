import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import { parseCookies } from "nookies";
import { NoProfile } from "../components/Layout/NoData";
import cookie from "js-cookie";

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

    return (
        <div>
        </div>
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