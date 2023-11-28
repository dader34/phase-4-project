import {useParams} from 'react-router-dom'
import PostCard from './PostCard'
import MainPost from './MainPost'
import '../STYLING/ViewOnePost.css';
import { useEffect, useState } from 'react'
const ViewOnePost = () => {
    const {id} = useParams()
    const [post, setPost] = useState(false)

    useEffect(()=>{
        fetch(`http://127.0.0.1:5555/posts/${id}`)
        .then(resp => resp.json())
        .then(setPost)
        .catch(alert)
    },[id])


    
    console.log(id)
    //Make fetch to id of post clicked on. Pass through url?
    //Display main post, and render comments in div under main div
    return(post.main ?
        <div className='container'>
            <div className='main-post'>
                {/* Render main post */}
                <PostCard author={{'name':post.main.user.username,'profile_picture':post.main.user.profile_picture}} date={post.main.created_at} views={post.main.views} content={post.main.content} likes={post.main.likes}/>
            </div>
            <div className='comments'>
                {/* Render child posts */}
                {post.comments.length?
                post.comments.map(comment => <PostCard key={comment.id} views={comment.views} author={{'name':comment.user.username,'profile_picture':comment.user.profile_picture}} date={comment.created_at} content={comment.content} likes={comment.likes} id={comment.id}/>)
                :
                <h5>No comments</h5>}
            </div>
        </div>
    : <h1>Loading...</h1>)
}

export default ViewOnePost