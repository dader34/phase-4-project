import React, { useState, useEffect } from 'react';
import PostCard from '../feed/PostCard';
import Modal from '../Common/Modal';
import '../STYLING/ProfilePage.css';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../STYLING/Modal.css';
import { ErrorMessage } from 'formik';
import UserCards from '../Common/UserCards';


const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [editedBio, setEditedBio] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const jwt = localStorage.getItem("JWT");
  const UID = localStorage.getItem("UID");
  const [showingFollowers, setShowingFollowers] = useState(false);
  const [showingFollowing, setShowingFollowing] = useState(false);
  const { id } = useParams();
  const nav = useNavigate();

  useEffect(() => {
    if (!jwt || !UID) {
      console.error('No JWT token or user ID found');
      nav('/');
      return;
    }

    fetch(`http://127.0.0.1:5555/user/${id}`, {
      headers: {
        Authorization: `Bearer ${jwt}`
      }
    })
    .then(response => response.ok ? response.json() : Promise.reject(response))
    .then(data => {
      setProfileData(data);
      setEditedBio(data.user_bio); 
    })
    .catch(errorResponse => {
      toast.error(errorResponse.message)
      // nav('/')
    });
  }, [id]);

  const handleEditBio = () => {
    setIsEditingBio(true);
  };

  const handleBioChange = (event) => {
    setEditedBio(event.target.value);
  };

  const handleSaveBio = () => {
    fetch(`http://127.0.0.1:5555/user/update-bio`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${jwt}`,
  },
  body: JSON.stringify({
    bio: editedBio,
  }),
})
  .then((response) => {
    if (!response.ok) {
      return response.text().then((text) => {
        throw new Error(text);
      });
    }
    return response.json();
  })
  .then((data) => {
    setProfileData({ ...profileData, user_bio: editedBio });
    toast.success('Bio updated successfully');
    setIsEditingBio(false);
  })
  .catch((error) => {
    toast.error(`Error: ${error.message || error}`);
  });

  };

  if (!profileData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isEditingBio && (
        <div className="modalOverlay"> 
          <div className="modalContainer"> 
            <div className="modalHeader"> 
              <h2>Edit Bio</h2>
              <button className="closeButton" onClick={() => setIsEditingBio(false)}>X</button> 
            </div>
            <div className="modalBody"> 
              <textarea className="modalInput" value={editedBio} onChange={handleBioChange}></textarea> 
              <button className="modalButton" onClick={handleSaveBio}>Save Changes</button> 
            </div>
          </div>
        </div>
      )}
        
      {!showingFollowing && !showingFollowers ? (
        <div className="profile-page">
          <div className="profile-container">
            <div className="profile-header" >
              <img className="profile-picture" src={profileData.profile_picture} alt={`${profileData.username}'s profile`} />
              <div className="profile-info">
                <h2 className="username">{profileData.username}</h2>
                <p className="bio">{profileData.user_bio}</p>
                {UID === id &&
                <button className="edit-bio-button" onClick={handleEditBio}>Edit Bio</button>}
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
                <PostCard key={post.id} author={{ 'name': post.user.username, 'profile_picture': post.user.profile_picture }} views={post.views} date={post.created_at} content={post.content} likes={post.likes} id={post.id} comments={post.comments} />
              ))}
          </div>
        </div>
        
      ) : <UserCards profileData={profileData} closeFollowers={() => setShowingFollowers(false)} closeFollowing={() => setShowingFollowing(false)} showingFollowing={showingFollowing} showingFollowers={showingFollowers} self={UID === id}/>}
    </>
  );
};

export default ProfilePage;
