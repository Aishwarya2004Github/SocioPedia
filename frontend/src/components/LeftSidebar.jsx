import { Heart, Home, LogOut, MessageCircle, PlusSquare, Search, TrendingUp, MoreHorizontal } from 'lucide-react';
import React, { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { toast } from 'sonner';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '@/redux/authSlice';
import CreatePost from './CreatePost';
import { setPosts, setSelectedPost } from '@/redux/postSlice';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Button } from './ui/button';
import logo from '../images/logo.png';

const LeftSidebar = () => {
    const navigate = useNavigate();
    const { user } = useSelector(store => store.auth);
    const { likeNotification } = useSelector(store => store.realTimeNotification);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false); // State to track fullscreen
    const [activeItem, setActiveItem] = useState('Home'); // State to track the active sidebar item

    const logoutHandler = async () => {
        try {
            const res = await axios.get('http://localhost:4000/api/v1/user/logout', { withCredentials: true });
            if (res.data.success) {
                dispatch(setAuthUser(null));
                dispatch(setSelectedPost(null));
                dispatch(setPosts([]));
                navigate("/login");
                toast.success(res.data.message);
            }
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const sidebarHandler = (textType) => {
        setActiveItem(textType); // Set the active item
        if (textType === 'Logout') {
            logoutHandler();
        } else if (textType === "Create") {
            setOpen(true);
        } else if (textType === "Profile") {
            navigate(`/profile/${user?._id}`);
        } else if (textType === "Home") {
            navigate("/");
        } else if (textType === 'Messages') {
            navigate("/chat");
        } else if (textType === 'Search') {
            navigate("/search");
        } else if (textType === 'Explore') {
            navigate("/explore");
        } else if (textType === 'Full Screen' || textType === 'Exit Full Screen') {
            toggleFullScreen();
        }
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    const sidebarItems = [
        { icon: <Home />, text: "Home" },
        { icon: <Search />, text: "Search" },
        { icon: <TrendingUp />, text: "Explore" },
        { icon: <MessageCircle />, text: "Messages" },
        { icon: <PlusSquare />, text: "Create" },
        {
            icon: (
                <Avatar className='w-6 h-6'>
                    <AvatarImage src={user?.profilePicture} alt="@shadcn" />
                    <AvatarFallback>{user?.username?.[0]}</AvatarFallback>
                </Avatar>
            ),
            text: "Profile"
        },
        { icon: <LogOut />, text: "Logout" },
    ];

    return (
        <div className='fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen'>
            <div className='flex flex-col'>
                <h1 className='text-center font-bold text-xl' style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <img src={logo} alt="Logo" style={{ height: '150px', width: '150px' }} />
                </h1>
                <div>
                    {
                        sidebarItems.map((item, index) => {
                            return (
                                <div 
                                    onClick={() => sidebarHandler(item.text)} 
                                    key={index} 
                                    className={`flex items-center gap-3 relative cursor-pointer rounded-lg p-3 my-3 ${activeItem === item.text ? 'bg-pink-500 text-white' : 'hover:bg-gray-100'}`}
                                >
                                    {item.icon}
                                    <span>{item.text}</span>
                                    {
                                        item.text === "Notifications" && likeNotification.length > 0 && (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button size='icon' className="rounded-full h-5 w-5 bg-red-600 hover:bg-red-600 absolute bottom-6 left-6">{likeNotification.length}</Button>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <div>
                                                        {
                                                            likeNotification.length === 0 ? (<p>No new notification</p>) : (
                                                                likeNotification.map((notification) => {
                                                                    return (
                                                                        <div key={notification.userId} className='flex items-center gap-2 my-2'>
                                                                            <Avatar>
                                                                                <AvatarImage src={notification.userDetails?.profilePicture} />
                                                                                <AvatarFallback>{notification.userDetails?.username?.[0]}</AvatarFallback>
                                                                            </Avatar>
                                                                            <p className='text-sm'><span className='font-bold'>{notification.userDetails?.username}</span> liked your post</p>
                                                                        </div>
                                                                    );
                                                                })
                                                            )
                                                        }
                                                    </div>
                                                </PopoverContent>
                                            </Popover>
                                        )
                                    }
                                </div>
                            );
                        })
                    }
                    {/* Popover for More options */}
                    <Popover>
                        <PopoverTrigger asChild>
                            <div onClick={() => sidebarHandler('More')} className='flex items-center gap-3 relative hover:bg-gray-100 cursor-pointer rounded-lg p-3 my-3'>
                                <MoreHorizontal />
                                <span>More</span>
                            </div>
                        </PopoverTrigger>
                        <PopoverContent>
                            <div className="flex flex-col">
                                <Button onClick={() => sidebarHandler('Full Screen')}>Full Screen</Button>
                                <Button onClick={() => sidebarHandler('Exit Full Screen')}>Exit Full Screen</Button>
                            </div>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>

            <CreatePost open={open} setOpen={setOpen} />
        </div>
    );
};

export default LeftSidebar;
