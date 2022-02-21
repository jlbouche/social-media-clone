import React, { useState } from "react";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import { parseCookies } from "nookies";

function Messages({chatsData}) {
    const [chats, setChats] = useState(chatsData);

    return (
        <div>Messages</div>
    )
}

Messages.getInitialProps = async ctx => {
    try {
      const { token } = parseCookies(ctx);
  
      const res = await axios.get(`${baseUrl}/api/chats`, {
        headers: { Authorization: token }
      });
  
      return { chatsData: res.data };
    } catch (error) {
      return { errorLoading: true };
    }
};

export default Messages;