import React, { useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';
import EmojiPicker from 'emoji-picker-react';
import { Box } from '@mui/material'; // Adjust import based on your setup

const EditProfile = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const imageRef = useRef();
  const { user } = useSelector((store) => store.auth);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState({
    profilePhoto: user?.profilePicture,
    bio: user?.bio || '',
    gender: user?.gender || '',
    emoji: '',
  });
  const [imagePreview, setImagePreview] = useState(user?.profilePicture || '');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle file input for profile photo change
  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, profilePhoto: file });
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  // Handle gender select change
  const selectChangeHandler = (value) => {
    setInput({ ...input, gender: value });
  };

  // Handle emoji picker click
  const handleEmojiClick = (emojiObject) => {
    setInput((prev) => ({
      ...prev,
      bio: prev.bio + emojiObject.emoji, // Append the emoji to bio
    }));
    setShowEmojiPicker(false); // Hide the emoji picker after selection
  };

  // Handle profile submission (form)
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(input);
  };

  // Handle profile update (API call)
  const editProfileHandler = async () => {
    const formData = new FormData();
    formData.append('bio', input.bio);
    formData.append('gender', input.gender);
    if (input.profilePhoto instanceof File) {
      formData.append('profilePhoto', input.profilePhoto);
    }

    try {
      setLoading(true);
      const res = await axios.post(
        'http://localhost:4000/api/v1/user/profile/edit',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        }
      );

      if (res.data.success) {
        const updatedUserData = {
          ...user,
          bio: res.data.user?.bio,
          profilePicture: res.data.user?.profilePicture,
          gender: res.data.user?.gender,
        };

        // Update the state with new user data
        dispatch(setAuthUser(updatedUserData));

        navigate(`/profile/${user?._id}`);
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex max-w-2xl mx-auto pl-10">
        <section className="flex flex-col gap-6 w-full my-8">
          <h1 className="font-bold text-xl">Edit Profile</h1>

          {/* Profile picture section */}
          <div className="flex items-center justify-between bg-gray-100 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={imagePreview} alt="profile_image" />
                <AvatarFallback>{user.username?.[0]}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="font-bold text-sm">{user?.username}</h1>
                <span className="text-gray-600">
                  {input.bio || 'Bio here...'}
                </span>
              </div>
            </div>
            <input ref={imageRef} onChange={fileChangeHandler} type="file" className="hidden" />
            <Button onClick={() => imageRef?.current.click()} className='bg-[#FF4162] text-white hover:bg-[#20C997]/90 dark:bg-[#20C997] dark:text-slate-50 h-8'>
              Change photo
            </Button>
          </div>

          {/* Bio section */}
          <div>
            <h1 className="font-bold text-xl mb-2">Bio</h1>
            <Textarea
              value={input.bio}
              onChange={(e) => setInput({ ...input, bio: e.target.value })}
              name="bio"
              maxLength={55}
              className="focus-visible:ring-transparent"
              onFocus={() => setShowEmojiPicker(false)}
            />
            <div className="text-right text-gray-500 text-sm">
    {input.bio.length}/55 characters
  </div>
            <Button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="mt-1" style={{position:'relative',top:'-64px',left:'650px'}}>
              😊
            </Button>
            {showEmojiPicker && (
              <Box sx={{ position: 'absolute',bottom:'10px', left: '1130px', zIndex: 1000 }}>
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </Box>
            )}
          </div>

          {/* Gender select section */}
          <div>
            <h1 className="font-bold mb-2">Gender</h1>
            <Select defaultValue={input.gender} onValueChange={selectChangeHandler}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
  <SelectGroup>
    <SelectItem value="male">Male</SelectItem>
    <SelectItem value="female">Female</SelectItem>
  </SelectGroup>
</SelectContent>

            </Select>
          </div>
          <p className="text-red-500 mt-2">
    *Without gender, the profile will not be edited
  </p>
          {/* Submit button section */}
          <div className="flex justify-end">
            {loading ? (
              <Button className='w-fit bg-[#FF4162] text-white hover:bg-[#20C997]/90 dark:bg-[#20C997] dark:text-slate-50 h-8'>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="button" onClick={editProfileHandler} className='w-fit bg-[#FF4162] text-white hover:bg-[#20C997]/90 dark:bg-[#20C997] dark:text-slate-50 h-8'>
                Submit
              </Button>
            )}
          </div>
        </section>
      </div>
    </form>
  );
};

export default EditProfile;
