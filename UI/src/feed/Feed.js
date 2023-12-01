import React, { useEffect, useState, useRef } from 'react';
import PostCard from './PostCard';
import AddPost from './AddPost';
import toast from 'react-hot-toast';
import '../STYLING/Feed.css';
import { useNavigate } from 'react-router-dom';

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [isAuth,setIsAuth] = useState(false)
  const [morePosts, setMorePosts] = useState(true);
  //the workhorse     vvvvvvv
  const loadingRef = useRef(false);
  const nav = useNavigate()

  useEffect(() => {
    // Fetch initial posts
    fetchPosts();

    // Add event listener for scroll with debounce
    const handleScroll = debounce(() => {
      // Check if the user has scrolled to the bottom of the page
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500 &&
        !loadingRef.current &&
        morePosts
      ) {
        // Increment the page and fetch more posts
        setPage((prevPage) => prevPage + 1);
        fetchPosts(page+1);
      }
    }, 500);

    window.addEventListener('scroll', handleScroll);

    // Make sure event listener is removed after useEffect is done
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [page,morePosts]);// eslint-disable-line

  useEffect(()=>{
    if(localStorage.getItem("UID") && localStorage.getItem("JWT"))
    fetch('/auth',{
      headers:{
        'Authorization':`Bearer ${localStorage.getItem("JWT")}`
      }
    }).then(resp => resp.json()).then(data => {
      if(data['success']){
        setIsAuth(true)
      }else{
        toast.error(data['msg'])
        nav('/')
      }
    })
    .catch(e => toast.error(e.message))
  },[nav])

  // Get posts
  const fetchPosts = (p) => {
    // Make sure no double requests happen
    if (loadingRef.current || !morePosts) return;

    loadingRef.current = true;

    fetch(`/posts?page=${p}&limit=5`)
      .then((resp) => resp.json())
      .then((data) => {
        setPosts((prevPosts) => [...prevPosts,...data.posts]);
        setMorePosts(data.more_posts);
        loadingRef.current = false;
      })
      .catch((e) => {
        console.log(e)
        toast.error(e.message);
        loadingRef.current = false;
      });
  };

  // Stackoverflow debounce lol
  function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }
  console.log(posts)

  return (
    <div className="feed-container">
      <div className="feed">
        {/* List of Tweet components */}
        {isAuth ? <AddPost /> : <h1 style={{textAlign:'center'}}>Please sign in to post</h1>}
        {posts.map((post) => (
          <PostCard
            key={`${post.id}-${post.content.slice(0, 5)}`}
            author={{
              name: post.user.username,
              profile_picture: post.user.profile_picture,
            }}
            views={post.views}
            date={post.created_at}
            content={post.content}
            likes={post.likes}
            id={post.id}
            comments={post.comments}
            user_id={post.user_id}
          />
        ))}
        {loadingRef.current && <p>Loading...</p>}
        {!morePosts && <p style={{textAlign:"center"}}>No more posts</p>}
      </div>
    </div>
  );
};

export default Feed;
