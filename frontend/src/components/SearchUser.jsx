import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './SearchUser.css'; // Import the CSS file

const SearchUser = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(''); // Clear previous errors

    try {
      const response = await axios.get(`/api/users/search`, {
        params: { username: query },
      });

      console.log("API Response:", response.data);

      if (Array.isArray(response.data) && response.data.length > 0) {
        console.log("Users found:", response.data);
        setResults(response.data);
      } else {
        console.log("No users found.");
        setResults([]);
      }
    } catch (error) {
      console.error('Error searching for users:', error);
      setResults([]);
      setError('Failed to search users.'); // Provide feedback on error
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userId) => {
    navigate(`/profile/${userId}`); // Navigate to user profile
  };

  return (
    <div className="search-user-container">
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by username"
          className="search-input"
          required // Make the input required
        />
        <button type="submit" disabled={loading} className="search-button">
          {loading ? 'Searching...' : 'Search'} {/* Change button text when loading */}
        </button>
      </form>

      <div className="search-results">
        {error && <p className="error-message">{error}</p>}
        {results.length > 0 ? (
          <ul className="results-list">
            {results.map((user) => (
              <li
                key={user._id}
                className="result-item"
                onClick={() => handleUserClick(user._id)} // Add click handler
              >
                <img
                  src={user.profilePicture || 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'}
                  alt={user.username}
                  className="user-avatar"
                />
                <span>{user.username}</span>
              </li>
            ))}
          </ul>
        ) : (
          !loading && <p className="no-results">No users found.</p>
        )}
      </div>
    </div>
  );
};

export default SearchUser;
