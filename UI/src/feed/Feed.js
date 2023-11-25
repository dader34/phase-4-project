import React, { useEffect, useState } from 'react';
import NavBar from '../Common/NavBar';
import PostCard from './PostCard';
import '../STYLING/Feed.css'
// Import other necessary components and hooks

const Feed = ({ user }) => {
  // Fetch and list tweets logic
  const [posts,setPosts] = useState([])
  useEffect(()=>{
    fetch('http://127.0.0.1:5555/posts')
    .then(resp => resp.json())
    .then(setPosts)
  },[])

  return (
    <div className='feed-container'>
      <div className="feed">
        {/* List of Tweet components */}
        {posts.forEach(post => console.log(post))}
        {posts.map(post => <PostCard key={post.id} author={{'name':post.user.username,'profile_picture':post.user.profile_picture}} views={post.views} date={post.created_at} content={post.content} likes={post.likes} id={post.id}/>)}
      </div>
    </div>
  );
};

export default Feed;
