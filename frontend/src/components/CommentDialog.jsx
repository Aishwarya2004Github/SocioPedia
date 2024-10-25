import React, { useEffect, useState } from 'react'
import { Dialog, DialogContent , DialogTitle, DialogDescription} from './ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Link } from 'react-router-dom'
import { Button } from './ui/button'
import { useDispatch, useSelector } from 'react-redux'
import Comment from './Comment'
import axios from 'axios'
import { toast } from 'sonner'
import { setPosts } from '@/redux/postSlice'
import EmojiPicker from 'emoji-picker-react';
import { Smile } from 'lucide-react';

const CommentDialog = ({ open, setOpen }) => {
  const [text, setText] = useState("");
  const { selectedPost, posts } = useSelector(store => store.post);
  const [comment, setComment] = useState([]);
  const dispatch = useDispatch();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (selectedPost) {
      setComment(selectedPost.comments);
    }
  }, [selectedPost]);

  const changeEventHandler = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  }
const onEmojiClick = (emojiObject) => {
    setText((prevText) => prevText + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  const sendMessageHandler = async () => {
    try {
      const res = await axios.post(`http://localhost:4000/api/v1/post/${selectedPost?._id}/comment`, { text }, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      if (res.data.success) {
        const updatedCommentData = [...comment, res.data.comment];
        setComment(updatedCommentData);

        const updatedPostData = posts.map(p =>
          p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPosts(updatedPostData));
        toast.success(res.data.message);
        setText("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)} className="max-w-5xl p-0 flex flex-col h-[80vh]"> 
      <DialogTitle className="sr-only">Comment Section</DialogTitle>
      <DialogDescription className="sr-only">Post comments and interact with the author</DialogDescription>
        <div className='flex flex-1'>
          <div className='w-1/2 h-[80vh]'>
            <img
              src={selectedPost?.image}
              alt="post_img"
              className='w-full h-full object-cover rounded-l-lg'
            />
          </div>
          <div className='w-1/2 flex flex-col justify-between'>
            <div className='flex items-center justify-between p-4'>
              <div className='flex gap-3 items-center'>
                <Link>
                  <Avatar>
                    <AvatarImage src={selectedPost?.author?.profilePicture} />
                    <AvatarFallback>{selectedPost?.author?.username?.[0]}</AvatarFallback>
                  </Avatar>
                </Link>
                <div>
                <Link className='font-semibold text-xs text-orange-500'>{selectedPost?.author?.username}</Link>

                </div>
              </div>

             
            </div>
            <hr />
            <div className='flex-1 overflow-y-auto max-h-[40vh] p-4'> {/* Adjusted max height */}
              {
                comment.map((comment) => <Comment key={comment._id} comment={comment} />)
              }
            </div>
            <div className='p-4'>
              <div className='flex items-center gap-2'>
                <input 
                  type="text" 
                  value={text} 
                  onChange={changeEventHandler} 
                  placeholder='Add a comment...' 
                  className='w-full outline-none border text-sm border-gray-300 p-2 rounded' 
                />
                  <Button onClick={() => setShowEmojiPicker(!showEmojiPicker)} variant="outline" className='h-8'>
                  <Smile />
                </Button>
                <Button 
                  disabled={!text.trim()} 
                  onClick={sendMessageHandler} 
                  variant="outline" 
                  className='bg-[#FF4162] text-white hover:bg-[#20C997]/90 dark:bg-[#20C997] dark:text-slate-50 h-8' // Added button styles
                >
                  Send
                </Button>
              </div>
              {showEmojiPicker && (
                <div className='absolute bottom-14'>
                  <EmojiPicker onEmojiClick={onEmojiClick} />
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CommentDialog;
