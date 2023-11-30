import React, { useState, useEffect } from 'react';
import PostCard from '../feed/PostCard';
import '../STYLING/ProfilePage.css';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const jwt = localStorage.getItem("JWT"); // Retrieve the JWT token from local storage
  const UID = localStorage.getItem("UID"); // Retrieve the user ID from local storage
  const [showingFollwers,setShowingFollowers] = useState(false)
  const [showingFollowing,setShowingFollowing] = useState(false)
  const {id} = useParams()
  const nav = useNavigate()
  useEffect(() => {
    // Check if the JWT token and user ID are available
    if (!jwt || !UID) {
      console.error('No JWT token or user ID found');
      nav('/')
      return;
    }

    fetch(`http://127.0.0.1:5555/user/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })
    .then(response => {
      if (!response.ok) {
        response.json()
          .then(data =>{throw new Error(data[Object.keys(data)[0]])})
          .catch(error => {
            toast.error(error.message);
            nav('/home')
          });
      }
      return response.json();
    })
    .then(data =>{ setProfileData(data); console.log(data);})
    .catch(error => console.error('Error fetching profile data:', error));
  }, [id]);

  if (!profileData) {
    return <div>Loading...</div>;
  }else{
    profileData.followers.forEach(follower => console.log(follower.follower))
  }
  
  return !(showingFollowing || showingFollwers) ? (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <img className="profile-picture" src={profileData.profile_picture} alt={`${profileData.username}'s profile`} />
          <div className="profile-info">
            <h2 className="username">{profileData.username}</h2>
            <p className="bio">{profileData.user_bio}</p>
            {UID === id &&
            <button className="edit-bio-button">Edit Bio</button>}
          </div>
        </div>
      </div>
      <div className='follow'>
      <div className="follow-count">
        <div onClick={() => setShowingFollowers(true)} style={{cursor:"pointer"}}>
          <span>Followers</span>
          <span>{profileData.followers.length}</span>
        </div>
        <div onClick={() => setShowingFollowing(true)} style={{cursor:"pointer"}}>
          <span>Following</span>
          <span>{profileData.following.length}</span>
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
  ): (
    showingFollowing ? 
      <div className="profile-page">
        <h1>Following</h1>
        <button className='back' onClick={() => setShowingFollowing(false)}>Back</button>
        {profileData.following.map(f => (
      <div key={f.following.id} className="follower-item">
        <img className="follower-picture" src={f.following.profile_picture} alt={f.following.username} />
        <div className="follower-info">
          <h3 className="follower-username">{f.following.username}</h3>
          <p className="follower-bio">{f.following.user_bio}</p>
          <button className="follow-button">Unfollow</button>
        </div>
      </div>
    ))}
      </div>
    :
    <div className="profile-page">
      <h1>Followers</h1>
      <button className='back' onClick={() => setShowingFollowers(false)}>Back</button> 
      {profileData.followers.map(f => (
      <div key={f.follower.id} className="follower-item">
        <img className="follower-picture" src={f.follower.profile_picture} alt={f.follower.username} />
        <div className="follower-info">
          <h3 className="follower-username">{f.follower.username}</h3>
          <p className="follower-bio">{f.follower.user_bio}</p>
          {/* Check if you are already following user */}
          <button className="follow-button">Follow</button>
        </div>
      </div>
    ))}
    </div>
  )
};

export default ProfilePage;
