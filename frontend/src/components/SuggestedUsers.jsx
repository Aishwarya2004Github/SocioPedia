import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import axios from 'axios';

const SuggestedUsers = () => {
    const { suggestedUsers } = useSelector(store => store.auth);
    const [followStatus, setFollowStatus] = useState({}); // Track follow state for each user

    // Load follow status from localStorage (or initialize with suggested users' follow status)
    useEffect(() => {
        const storedFollowStatus = JSON.parse(localStorage.getItem('followStatus')) || {};
        const initialFollowStatus = {};

        suggestedUsers.forEach(user => {
            // Check if there's stored follow status for the user, otherwise use 'isFollowing' from backend
            initialFollowStatus[user._id] = storedFollowStatus[user._id] !== undefined ? storedFollowStatus[user._id] : user.isFollowing || false;
        });

        setFollowStatus(initialFollowStatus);
    }, [suggestedUsers]);

    // Save updated follow status to localStorage
    const saveFollowStatusToLocalStorage = (updatedStatus) => {
        localStorage.setItem('followStatus', JSON.stringify(updatedStatus));
    };

    const handleFollow = async (userId) => {
        try {
            const response = await axios.post(`http://localhost:4000/api/v1/user/followorunfollow/${userId}`);
            if (response.data.success) {
                // Toggle the follow/unfollow state for this user
                const updatedStatus = {
                    ...followStatus,
                    [userId]: !followStatus[userId], // Toggle follow/unfollow
                };

                setFollowStatus(updatedStatus);
                saveFollowStatusToLocalStorage(updatedStatus); // Save to localStorage

                console.log(response.data.message);
            } else {
                console.error(response.data.message);
            }
        } catch (error) {
            console.error("Error following/unfollowing:", error);
        }
    };

    return (
        <div className='my-10'>
            <div className='flex items-center justify-between text-sm'>
            <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
            <span className='font-medium cursor-pointer ml-2 text-[#20C997]'>See All</span>


            </div>
            {
                suggestedUsers.map((user) => {
                    const isFollowing = followStatus[user._id]; // Get current follow status for each user

                    return (
                        <div key={user._id} className='flex items-center justify-between my-5'>
                            <div className='flex items-center gap-2'>
                                <Link to={`/profile/${user?._id}`} >
                                    <Avatar>
                                        <AvatarImage src={user?.profilePicture} alt="profile_image" />
                                        <AvatarFallback>{user.username?.[0]}</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <div>
                                    <h1 className='font-semibold text-sm'>
                                        <Link to={`/profile/${user?._id}`} style={{ color: '#20C997' }}>
  {user?.username}
</Link>

                                    </h1>
                                    <span className='text-gray-600 text-sm'>{user?.bio || 'Bio here...'}</span>
                                </div>
                            </div>

                            <span 
                                className={`text-xs font-bold cursor-pointer ${isFollowing ? 'text-red-500' : 'text-[#3BADF8]'} hover:text-[#3495d6]`} 
                                onClick={() => handleFollow(user._id)}
                            >
                                {isFollowing ? 'UnFollow' : 'Follow'}
                            </span>
                        </div>
                    );
                })
            }
        </div>
    );
}

export default SuggestedUsers;
