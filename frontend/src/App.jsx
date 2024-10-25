import React, { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { setSocket } from './redux/socketSlice';
import { setOnlineUsers } from './redux/chatSlice';
import ProtectedRoutes from './components/ProtectedRoutes';
import SearchUser from './components/SearchUser'; // Import the SearchUser component
import Home from './components/Home';
import Profile from './components/Profile';
import ChatPage from './components/ChatPage';
import EditProfile from './components/EditProfile';
import Login from './components/Login';
import Signup from './components/Signup';
import MainLayout from './components/MainLayout';
import Explore from './components/Explore';
const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoutes><MainLayout /></ProtectedRoutes>,
    children: [
      { path: '/', element: <ProtectedRoutes><Home /></ProtectedRoutes> },
      { path: '/profile/:id', element: <ProtectedRoutes><Profile /></ProtectedRoutes> },
      { path: '/account/edit', element: <ProtectedRoutes><EditProfile /></ProtectedRoutes> },
      { path: '/chat', element: <ProtectedRoutes><ChatPage /></ProtectedRoutes> },
      { path: '/search', element: <ProtectedRoutes><SearchUser /></ProtectedRoutes> },
      { path: '/explore', element: <ProtectedRoutes><Explore /></ProtectedRoutes> }, // Add SearchUser route
    ]
  },
  { path: '/login', element: <Login /> },
  { path: '/signup', element: <Signup /> },
]);

function App() {
  const { user } = useSelector(store => store.auth);
  const { socket } = useSelector(store => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:4000', {
        query: { userId: user?._id },
        transports: ['websocket'],
      });

      dispatch(setSocket(socketio));

      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUsers(onlineUsers));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      };
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);

  return <RouterProvider router={browserRouter} />;
}

export default App;
