import React, { useEffect, useState, useRef } from 'react';
import PostCard from './PostCard';
import AddPost from './AddPost';
import toast from 'react-hot-toast';
import '../STYLING/Feed.css';

const Feed = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [isAuth,setIsAuth] = useState(false)
  const [morePosts, setMorePosts] = useState(true);
  const loadingRef = useRef(false);

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
  }, [page]); // Add morePosts to the dependency array

  useEffect(()=>{
    if(localStorage.getItem("UID") && localStorage.getItem("JWT"))
    fetch('http://127.0.0.1:5555/auth',{
      headers:{
        'Authorization':`Bearer ${localStorage.getItem("JWT")}`
      }
    }).then(resp => resp.json()).then(data => {if(data['success']){setIsAuth(true)}}).catch(e => toast.error(e.message))
  },[])

  // Get posts
  const fetchPosts = (p) => {
    // Make sure no double requests happen
    if (loadingRef.current || !morePosts) return;

    loadingRef.current = true;

    fetch(`http://127.0.0.1:5555/posts?page=${p}&limit=10`)
      .then((resp) => resp.json())
      .then((data) => {
        setPosts((prevPosts) => [...prevPosts,...data.posts]);
        setMorePosts(data.more_posts);
        loadingRef.current = false;
      })
      .catch((e) => {
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
          />
        ))}
        {loadingRef.current && <p>Loading...</p>}
        {!morePosts && <p>No more posts</p>}
      </div>
    </div>
  );
};

export default Feed;
