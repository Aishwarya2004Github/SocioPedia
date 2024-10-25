import express from 'express'; // Use import instead of require
import { User } from '../models/user.model.js'; // Ensure to include the correct extension

const router = express.Router();

// Search users by username
router.get('/search', async (req, res) => {
  const { username } = req.query;

  console.log("Searching for username:", username); // Log the username being searched

  if (!username || username.trim() === '') {
    return res.status(400).json({ message: 'Username query is required.' });
  }

  try {
    const users = await User.find({
      username: { $regex: username.trim(), $options: 'i' }, // Use .trim() to remove any leading/trailing spaces
    });

    if (users.length > 0) {
      console.log("Users found:", users); // Log the found users
      return res.json(users); // Return the found users
    } else {
      console.log("No users found."); // Log when no users are found
      return res.json([]); // Return an empty array if no users found
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Server error', error });
  }
});

export default router; // Use export default
