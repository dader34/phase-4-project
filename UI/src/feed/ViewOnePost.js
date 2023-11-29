import {useParams,useNavigate} from 'react-router-dom'
import PostCard from './PostCard'
import '../STYLING/ViewOnePost.css';
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
const ViewOnePost = () => {
    const UID = parseInt(localStorage.getItem("UID"));
    const JWT = localStorage.getItem("JWT")
    const nav = useNavigate()
    const {id} = useParams()
    const [post, setPost] = useState(false)

    useEffect(()=>{
        fetch(`http://127.0.0.1:5555/posts/${id}`)
        .then(resp => resp.json())
        .then(setPost)
        .catch(alert);

        (UID || JWT)&& 
              fetch("http://127.0.0.1:5555/auth",{
                  headers:{
                      "Authorization": `Bearer ${JWT}`
                  }
              })
              .then(resp => resp.json())
              .then(data => {
                  if(!(data && data.success)){
                      nav('/')
                      toast.error("Your session has expired, please log in again")
                  }
              })
    },[id])
    // console.log(post.main)
    console.log(post)
    // console.log(id)
    //Make fetch to id of post clicked on. Pass through url?
    //Display main post, and render comments in div under main div
    return(post.main ?
        <div className='container'>
            <div className='main-post'>
                {/* Render main post */}
                {(post.main.comments || post.comments) &&
                    <PostCard author={{'name':post.main.user.username,'profile_picture':post.main.user.profile_picture}} date={post.main.created_at} views={post.main.views} content={post.main.content} likes={post.main.likes} comments={post.main.comments || post.comments} id={post.main.id}/>
                }
            </div>
            <div className='comments'>
                {/* Render child posts */}
                {post.comments.length?
                post.comments.map(comment => <PostCard key={comment.id} views={comment.views} author={{'name':comment.user.username,'profile_picture':comment.user.profile_picture}} date={comment.created_at} content={comment.content} likes={comment.likes} id={comment.id} comments={comment.comments}/>)
                :
                <h5>No comments</h5>}
            </div>
        </div>
    : <h1>Loading...</h1>)
}

export default ViewOnePost