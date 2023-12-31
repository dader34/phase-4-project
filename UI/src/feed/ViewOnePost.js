import {useParams,useNavigate} from 'react-router-dom'
import PostCard from './PostCard'
import '../STYLING/ViewOnePost.css';
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast';
const ViewOnePost = () => {
    const UID = localStorage.getItem("UID")
    const JWT = localStorage.getItem("JWT")
    const nav = useNavigate()
    const {id} = useParams()
    const [post, setPost] = useState(false)

    useEffect(()=>{
        fetch(`/posts/${id}`)
        .then(resp => resp.json())
        .then(setPost)
        .catch(e => toast.error(e.message));
        (UID || JWT)&& 
              fetch("/auth",{
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
    },[id, JWT, UID, nav])
    //Make fetch to id of post clicked on. Pass through url?
    //Display main post, and render comments in div under main div
    return(post.main ?
        <div className='container'>
            <div className='main-post'>
                {/* Render main post */}
                {(post.main.comments || post.comments) &&
                    <PostCard author={{'name':post.main.user.username,'profile_picture':post.main.user.profile_picture}} date={post.main.created_at} views={post.main.views} content={post.main.content} likes={post.main.likes} comments={post.main.comments || post.comments} id={post.main.id} user_id={post.main.user.id}/>
                }
            </div>
            <div className='comments'>
                {/* Render child posts */}
                {post.comments.length?
                post.comments.map(comment => <PostCard key={comment.id} views={comment.views} author={{'name':comment.user.username,'profile_picture':comment.user.profile_picture}} date={comment.created_at} content={comment.content} likes={comment.likes} id={comment.id} comments={comment.comments} user_id={comment.user.id}/>)
                :
                <h5>No comments</h5>}
            </div>
        </div>
    : <h1>Loading...</h1>)
}

export default ViewOnePost