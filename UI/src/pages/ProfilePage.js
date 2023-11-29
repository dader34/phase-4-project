import React, { useState, useEffect } from 'react';
import PostCard from '../feed/PostCard';
import '../STYLING/ProfilePage.css';
const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const jwt = localStorage.getItem("JWT"); // Retrieve the JWT token from local storage
  const userId = localStorage.getItem("UID"); // Retrieve the user ID from local storage

  useEffect(() => {
    // Check if the JWT token and user ID are available
    if (!jwt || !userId) {
      console.error('No JWT token or user ID found');
      return;
    }

    fetch(`http://127.0.0.1:5555/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data =>{ setProfileData(data); console.log(data);})
    .catch(error => console.error('Error fetching profile data:', error));
  }, [jwt, userId]); // This will reload the data if the JWT token or user ID changes

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <img className="profile-picture" src={profileData.profile_picture} alt={`${profileData.username}'s profile`} />
          <div className="profile-info">
            <h2 className="username">{profileData.username}</h2>
            <p className="bio">{profileData.user_bio}</p>
            <button className="edit-bio-button">Edit Bio</button>
          </div>
        </div>
      </div>
      <div className="tweets-container">
        {profileData.posts && Array.isArray(profileData.posts) && 
          profileData.posts.map(post => (
            <PostCard key={post.id} author={{'name':post.user.username,'profile_picture':post.user.profile_picture}} views={post.views} date={post.created_at} content={post.content} likes={post.likes} id={post.id} comments={post.comments}/>
            ))}
      </div>
    </div>
  );
};

export default ProfilePage;
