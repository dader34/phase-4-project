import { useEffect, useState } from "react"
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";

const UserCards = ({showingFollowing,showingFollowers,closeFollowing,closeFollowers,profileData, self}) =>{
//    make fetch to UID of self profile, get following and followers data, set in state and determine follow/unfollow off of that
//    make route to follow/unfollow (Backend does logic and sends back "status":"Follow"/"Unfollow")
const [following,setFollowing] = useState([])
const UID = parseInt(localStorage.getItem("UID")) 
const JWT = localStorage.getItem("JWT")
const nav = useNavigate()
useEffect(()=>{
        fetch(`http://127.0.0.1:5555/user/${UID}`,{
            headers: {
                "Authorization":`Bearer ${JWT}`
            }
        }).then(resp => {
            if (resp.ok){
                resp.json().then(data =>{
                    if(data.following[0]){
                        data.following.forEach(f =>{
                            console.log(f.following)
                            if(!following.includes(f.following.username)){
                                setFollowing(current => [f.following.username ,...current])
                            }
                        })
                    }
                })
            }else{
                toast.error(resp.message)
            }
        }).catch(e => toast.error(e))
            console.log(self)
    },[])

    if (showingFollowing){
        return(
        <div className="profile-page">
        {/* Check if you are following user and if so cond render follow/unfollow */}
          <h1>Following</h1>
          <button className='back' onClick={closeFollowing}>Back</button>
          {profileData.following.map(f => (
            <div key={f.following.id} className="follower-item" >
              <img className="follower-picture" src={f.following.profile_picture} alt={f.following.username} style={{cursor:"pointer"}} onClick={() => {closeFollowing();nav(`/home/profile/${f.following.id}`)}}/>
              <div className="follower-info">
                <h3 className="follower-username">{f.following.username}</h3>
                <p className="follower-bio">{f.following.user_bio}</p>
                {!(parseInt(f.following.id)===UID) && <button className="follow-button">{self ? 'Unfollow' : (following.includes(f.following.username) ? 'Unfollow' : 'Follow')}</button>}
              </div>
            </div>
          ))}
        </div>
      )}
      else if(showingFollowers){ return (
        <div className="profile-page">
          <h1>Followers</h1>
          <button className='back' onClick={closeFollowers}>Back</button> 
          {profileData.followers.map(f => (
            <div key={f.follower.id} className="follower-item">
              <img className="follower-picture" src={f.follower.profile_picture} alt={f.follower.username} style={{cursor:"pointer"}}  onClick={() => {closeFollowers();nav(`/home/profile/${f.follower.id}`)}}/>
              <div className="follower-info">
                <h3 className="follower-username">{f.follower.username}</h3>
                <p className="follower-bio">{f.follower.user_bio}</p>
                {!(parseInt(f.follower.id)===UID) && <button className="follow-button">{following.includes(f.follower.username)?"Unfollow" : "Follow"}</button>}
              </div>
            </div>
          ))}
        </div>
      )}
}
export default UserCards