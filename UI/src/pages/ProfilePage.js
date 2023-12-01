import React, { useState, useEffect } from 'react';
import PostCard from '../feed/PostCard';
import '../STYLING/ProfilePage.css';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import '../STYLING/Modal.css';
import UserCards from '../Common/UserCards';

const ProfilePage = () => {
  const [profileData, setProfileData] = useState(null);
  const [editedBio, setEditedBio] = useState("");
  const [isEditingBio, setIsEditingBio] = useState(false);
  const jwt = localStorage.getItem("JWT");
  const UID = localStorage.getItem("UID");
  const [showingFollowers, setShowingFollowers] = useState(false);
  const [showingFollowing, setShowingFollowing] = useState(false);
  const [following, setFollowing] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const { id } = useParams();
  const nav = useNavigate();

  useEffect(() => {
    if (!jwt || !UID) return nav('/');

    fetch(`https://birdnoise.danner.repl.co/user/${id}`, { headers: { Authorization: `Bearer ${jwt}` } })
      .then(response => response.ok ? response.json() : Promise.reject(response))
      .then(data => {
        setProfileData(data);
        setEditedBio(data.user_bio);
      })
      .catch(() => toast.error("Invalid profile"))
      .finally(() => setShowingFollowers(false) && setShowingFollowing(false));

  }, [id, jwt, nav, UID]);

  useEffect(() => {
    if (profileData && profileData.username) {
      fetch(`https://birdnoise.danner.repl.co/user/${UID}`, { headers: { Authorization: `Bearer ${jwt}` } })
        .then(resp => resp.ok ? resp.json() : Promise.reject(resp))
        .then(data => {
          const followingUsernames = data.following.map(f => f.following.username);
          setFollowing(followingUsernames);
          setIsFollowing(followingUsernames.includes(profileData.username));
        })
        .catch(e => toast.error(e));
    }

  }, [UID, jwt, profileData]);

  const handleEditBio = () => setIsEditingBio(true);
  const handleBioChange = (event) => setEditedBio(event.target.value);

  const handleSaveBio = () => {
    fetch(`https://birdnoise.danner.repl.co/user/update-bio`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwt}` },
      body: JSON.stringify({ bio: editedBio }),
    })
      .then(response => response.ok ? response.json() : Promise.reject(response))
      .then(data => {
        setProfileData({ ...profileData, user_bio: editedBio });
        toast.success('Bio updated successfully');
        setIsEditingBio(false);
      })
      .catch(error => toast.error(`Error: ${error.message || error}`));

  };

  const handleFollow = () => {
    fetch(`https://birdnoise.danner.repl.co/follow/${id}`, { method: "POST", headers: { "Authorization": `Bearer ${jwt}` } })
      .then(resp => resp.ok ? resp.json() : Promise.reject(resp))
      .then(data => setIsFollowing(data.status === "Unfollow"))
      .catch(error => toast.error(`Error: ${error.message || error}`));
  }

  if (!profileData) return <div>Loading...</div>;

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
              <textarea className="modalInputs" value={editedBio} onChange={handleBioChange}></textarea>
              <button className="modalButton" onClick={handleSaveBio}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {!showingFollowing && !showingFollowers ? (
        <div className="profile-page">
          <div className="profile-container">
            <div className="profile-header">
              <img className="profile-picture" src={profileData.profile_picture} alt={`${profileData.username}'s profile`} />
              <div className="profile-info">
                <h2 className="username">{profileData.username}</h2>
                <p className="bio">{profileData.user_bio}</p>
                {UID === id ?
                  <button className="edit-bio-button" onClick={handleEditBio}>Edit Bio</button> :
                  <button className="edit-bio-button" onClick={handleFollow}>{isFollowing ? "Unfollow" : "Follow"}</button>
                }
              </div>
            </div>
          </div>
          <div className='follow'>
            <div className="follow-count">
              <div onClick={() => setShowingFollowers(true)} style={{ cursor: "pointer" }}>
                <span>Followers</span>
                <span>{profileData.followers.length}</span>
              </div>
              <div onClick={() => setShowingFollowing(true)} style={{ cursor: "pointer" }}>
                <span>Following</span>
                <span>{profileData.following.length}</span>
              </div>
            </div>
          </div>
          <div className="tweets-container">
            {profileData.posts && Array.isArray(profileData.posts) &&
              profileData.posts.map(post => (
                <PostCard key={post.id} author={{ 'name': post.user.username, 'profile_picture': post.user.profile_picture }} views={post.views} date={post.created_at} content={post.content} likes={post.likes} id={post.id} comments={post.comments} user_id={profileData.id} />
              ))}
          </div>
        </div>
      ) : <UserCards profileData={profileData} closeFollowers={() => setShowingFollowers(false)} closeFollowing={() => setShowingFollowing(false)} showingFollowing={showingFollowing} showingFollowers={showingFollowers} self={UID === id} following={following} />}
    </>
  );
};

export default ProfilePage;
