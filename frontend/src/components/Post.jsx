import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog';
import { Bookmark, MessageCircle, MoreHorizontal, Send } from 'lucide-react';
import { Button } from './ui/button';
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CommentDialog from './CommentDialog';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'sonner';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { Badge } from './ui/badge';
import { Link } from 'react-router-dom'; // Import Link here
import useGetUserProfile from '@/hooks/useGetUserProfile';

const Post = ({ post }) => {
    const [text, setText] = useState("");
    const [open, setOpen] = useState(false);
    const { user } = useSelector(store => store.auth);
    const { posts } = useSelector(store => store.post);
    const [liked, setLiked] = useState(post.likes.includes(user?._id) || false);
    const [postLike, setPostLike] = useState(post.likes.length);
    const [comment, setComment] = useState(post.comments);
    const dispatch = useDispatch();
    const [isFollowing, setIsFollowing] = useState(false);
   
    const userId = post.author?._id; // Assuming this is the author of the post
    useGetUserProfile(userId);

    useEffect(() => {
        const storedFollowStatus = JSON.parse(localStorage.getItem('followStatus')) || {};
        setIsFollowing(storedFollowStatus[userId] || false);
    }, [userId]);

    const handleFollow = async () => {
        try {
            const response = await axios.post(`https://sociopedia-9rlt.onrender.com/api/v1/user/followorunfollow/${userId}`, {}, { withCredentials: true });
            if (response.data.success) {
                const updatedStatus = !isFollowing; // Toggle the following status
                setIsFollowing(updatedStatus);

                // Update follow status in localStorage
                const storedFollowStatus = JSON.parse(localStorage.getItem('followStatus')) || {};
                storedFollowStatus[userId] = updatedStatus;
                localStorage.setItem('followStatus', JSON.stringify(storedFollowStatus));

                toast.success(updatedStatus ? 'Followed successfully' : 'Unfollowed successfully');
            }
        } catch (error) {
            console.error('Error following/unfollowing:', error);
            toast.error('An error occurred while following/unfollowing');
        }
    };

    const changeEventHandler = (e) => {
        const inputText = e.target.value;
        if (inputText.trim()) {
            setText(inputText);
        } else {
            setText("");
        }
    };

    const likeOrDislikeHandler = async () => {
        try {
            const action = liked ? 'dislike' : 'like';
            const res = await axios.get(`https://sociopedia-9rlt.onrender.com/api/v1/post/${post._id}/${action}`, { withCredentials: true });
            console.log(res.data);
            if (res.data.success) {
                const updatedLikes = liked ? postLike - 1 : postLike + 1;
                setPostLike(updatedLikes);
                setLiked(!liked);

                // Update post data
                const updatedPostData = posts.map(p =>
                    p._id === post._id ? {
                        ...p,
                        likes: liked ? p.likes.filter(id => id !== user._id) : [...p.likes, user._id]
                    } : p
                );
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const commentHandler = async () => {
        try {
            const res = await axios.post(`https://sociopedia-9rlt.onrender.com/api/v1/post/${post._id}/comment`, { text }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            console.log(res.data);
            if (res.data.success) {
                const updatedCommentData = [...comment, res.data.comment];
                setComment(updatedCommentData);

                const updatedPostData = posts.map(p =>
                    p._id === post._id ? { ...p, comments: updatedCommentData } : p
                );

                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
                setText("");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const deletePostHandler = async () => {
        try {
            const res = await axios.delete(`https://sociopedia-9rlt.onrender.com/api/v1/post/delete/${post?._id}`, { withCredentials: true });
            if (res.data.success) {
                const updatedPostData = posts.filter((postItem) => postItem?._id !== post?._id);
                dispatch(setPosts(updatedPostData));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    const bookmarkHandler = async () => {
        try {
            const res = await axios.get(`https://sociopedia-9rlt.onrender.com/api/v1/post/${post?._id}/bookmark`, { withCredentials: true });
            if (res.data.success) {
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='my-8 w-full max-w-sm mx-auto'>
            <div className='flex items-center justify-between'>
                <div className='flex items-center gap-2'>
                    <Avatar>
                        <AvatarImage src={post.author?.profilePicture} alt="post_image" />
                        <AvatarFallback>{post.author?.username?.[0] }</AvatarFallback>
                    </Avatar>
                    <div className='flex items-center gap-3'>
                        <Link to={`/profile/${post.author?._id}`}>
                        <h1 className="text-orange-500">{post.author?.username}</h1>

                        </Link>
                        {user?._id === post.author._id && <Badge variant="secondary">Author</Badge>}
                    </div>
                </div>
                <Dialog>
                    <DialogTrigger asChild>
                        <MoreHorizontal className='cursor-pointer' />
                    </DialogTrigger>
                    <DialogContent className="flex flex-col items-center text-sm text-center">
                        {/* Unfollow button is conditionally rendered */}
                        {post?.author?._id !== user?._id && (
                            <Button
                                variant='ghost'
                                className="cursor-pointer w-fit text-[#ED4956] font-bold"
                                onClick={handleFollow}
                            >
                                {isFollowing ? 'Unfollow' : 'Follow'}
                            </Button>
                        )}
                        {user && user?._id === post?.author._id && (
                            <Button
                                onClick={deletePostHandler}
                                variant='ghost'
                                className="cursor-pointer w-fit"
                            >
                                Delete
                            </Button>
                        )}
                    </DialogContent>
                </Dialog>
            </div>
            <img
                className='rounded-sm my-2 w-full aspect-square object-cover'
                src={post.image}
                alt="post_img"
            />
           <div className='flex items-center justify-between my-2'>
    <div className='flex items-center gap-3'>
        {liked ? (
            <FaHeart onClick={likeOrDislikeHandler} size={'24'} className='cursor-pointer text-red-600' />
        ) : (
            <FaRegHeart onClick={likeOrDislikeHandler} size={'22'} className='cursor-pointer hover:text-gray-600' />
        )}
        <MessageCircle
            onClick={() => {
                dispatch(setSelectedPost(post));
                setOpen(true);
            }}
            className='cursor-pointer hover:text-[#20C997]' // Change hover color for message icon
        />
    </div>
    <Bookmark
        onClick={bookmarkHandler}
        className='cursor-pointer hover:text-[#FF4162]' // Change hover color for bookmark icon
    />
</div>

            <span className='font-medium block mb-2'>{postLike} likes</span>
            <p>
                <span className='font-medium mr-2'>
                    <Link to={`/profile/${post.author?._id}`} className="hover:underline">
                    <h1>
    <span className="text-orange-500">{post.author?.username}</span>
  </h1>
                    </Link>
                </span>
                {post.caption}
            </p>
            {comment.length > 0 && (
                <span onClick={() => {
                    dispatch(setSelectedPost(post));
                    setOpen(true);
                }} className='cursor-pointer text-sm text-gray-400'>View all {comment.length} comments</span>
            )}
            <CommentDialog open={open} setOpen={setOpen} />
            <div className='flex items-center justify-between'>
                <input
                    type="text"
                    placeholder='Add a comment...'
                    value={text}
                    onChange={changeEventHandler}
                    className='outline-none text-sm w-full'
                />
                {text && <span onClick={commentHandler} className='text-[#3BADF8] cursor-pointer'>Post</span>}
            </div>
        </div>
    );
};

export default Post;
