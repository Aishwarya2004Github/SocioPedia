import React, { useRef, useState } from 'react';
import { Dialog,DialogTitle, DialogContent, DialogHeader , DialogDescription} from './ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Textarea } from './ui/textarea';
import { Button } from './ui/button';
import { readFileAsDataURL } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/postSlice';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import EmojiPicker from 'emoji-picker-react';

const CreatePost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useSelector(store => store.auth);
  const { posts } = useSelector(store => store.post);
  const dispatch = useDispatch();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fileChangeHandler = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      const dataUrl = await readFileAsDataURL(file);
      setImagePreview(dataUrl);
    }
  };

  const createPostHandler = async (e) => {
    e.preventDefault(); // Prevent default form submission
    if (!caption.trim()) {
      toast.error("Caption is required");
      return;
    }
  
    const formData = new FormData();
    formData.append("caption", caption);
    if (file) formData.append("image", file);
  
    try {
      setLoading(true);
      const res = await axios.post('http://localhost:4000/api/v1/post/addpost', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setPosts([res.data.post, ...posts]));
        toast.success(res.data.message);
        setCaption(""); // Reset caption
        setFile(""); // Reset file
        setImagePreview(""); // Reset image preview
        setOpen(false);
      }
    } catch (error) {
      console.error(error); // Log error for debugging
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle emoji selection
const onEmojiClick = (emojiObject) => {
  setCaption((prevCaption) => prevCaption + emojiObject.emoji);
};


  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
      <DialogTitle>
          <VisuallyHidden>Create New Post</VisuallyHidden> {/* Hide the title visually */}
        </DialogTitle>
        <DialogHeader className='text-center font-semibold'>Create New Post</DialogHeader>
        <DialogDescription className="mb-4">
          Please fill out the details for your new post.
        </DialogDescription>
        <div className='flex gap-3 items-center'>
          <Avatar>
            <AvatarImage src={user?.profilePicture} alt="img" />
            <AvatarFallback>{user?.username?.[0] }</AvatarFallback>
          </Avatar>
          <div>
            <h1 className='font-semibold text-xs'>{user?.username}</h1>
            <span className='text-gray-600 text-xs'>{user?.bio}</span>
          </div>
        </div>
        <Textarea value={caption} onChange={(e) => setCaption(e.target.value)} className="focus-visible:ring-transparent border-none" placeholder="Write a caption..." />
        <Button onClick={() => setShowEmojiPicker(!showEmojiPicker)} className="mt-2">
          {showEmojiPicker ? 'Close Emoji Picker' : 'Add Emoji'}
        </Button>
        {showEmojiPicker && (
          <div className="mt-2 ml-20">
            <EmojiPicker onEmojiClick={onEmojiClick} />
          </div>
        )}
        {imagePreview && (
          <div className='w-full h-64 flex items-center justify-center'>
            <img src={imagePreview} alt="preview_img" className='object-cover h-full w-full rounded-md' />
          </div>
        )}
        <input ref={imageRef} type='file' className='hidden' onChange={fileChangeHandler} />
        <Button onClick={() => imageRef.current.click()} className='w-fit mx-auto bg-[#FF4162] hover:bg-[#20C997]/90 dark:bg-[#20C997]'>Select from computer</Button>
        {imagePreview && (
          loading ? (
            <Button>
              <Loader2 className='mr-2 h-4 w-4 animate-spin' />
              Please wait
            </Button>
          ) : (
            <Button 
            onClick={createPostHandler} 
            type="submit" 
            className="w-full bg-[#FF4162] text-white hover:bg-[#20C997]/90 dark:bg-[#20C997] dark:text-slate-50"
          >
            Post
          </Button>
          
          )
        )}
      </DialogContent>
    </Dialog>
  );
}

export default CreatePost;
