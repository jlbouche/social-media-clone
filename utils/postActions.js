import axios from 'axios';
import baseUrl from './baseUrl';
import catchErrors from './catchErrors';
import cookie from 'js-cookie'

const Axios = axios.creat({
    baseURL: `${baseUrl}/api/posts`,
    headers: {Authorization: cookie.get('token')}
});

export const submitNewPost=async(user, text, location, picUrl, setPosts, setNewPost, setError)=>{
    try {
        const res= await Axios.post('/', {text, location, picUrl})

        const newPost = {
            _id: res.data,
            user,
            text,
            location,
            picUrl,
            likes:[],
            comments:[],
        }

        setPosts(prev=>[newPost, ...prev])

        setNewPost({text: '', location: ''})

    } catch (error) {
        const errorMsg = catchErrors(error)
        setError(errorMsg)
    }
}

export const deletePost = async (postId, setPosts, setShowToastr) => {
    try {
        await Axios.delete(`/${postId}`);
        setPosts(prev => prev.filter(post => post._id !== postId));
        setShowToastr(true);
    } catch (error) {
        alert(catchErrors(error));
    }
};