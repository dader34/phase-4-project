import React from 'react';
import NavBar from '../Common/NavBar';
import PostCard from './PostCard';
// Import other necessary components and hooks

const Feed = ({ user }) => {
  // Fetch and list tweets logic

  return (
    <>
    <div className="feed">
      {/* List of Tweet components */}
      <PostCard 
      author={
        {name:"Danner",
        profile_picture:"https://merriam-webster.com/assets/mw/images/article/art-wap-landing-mp-lg/egg-3442-4c317615ec1fd800728672f2c168aca5@1x.jpg"
        
        }}
      content={"Test tweet"}
      likes={10}
        />
        <PostCard 
      author={
        {name:"Danner",
        profile_picture:"https://merriam-webster.com/assets/mw/images/article/art-wap-landing-mp-lg/egg-3442-4c317615ec1fd800728672f2c168aca5@1x.jpg"
        
        }}
      content={"Test tweet"}
      likes={10}
        />
    </div>
    </>
  );
};

export default Feed;
