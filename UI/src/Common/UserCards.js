import { useEffect, useState } from "react"
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import UserCard from "./UserCard";

const UserCards = ({showingFollowing,showingFollowers,closeFollowing,closeFollowers,profileData, self}) =>{
//    make fetch to UID of self profile, get following and followers data, set in state and determine follow/unfollow off of that
//    make route to follow/unfollow (Backend does logic and sends back "status":"Follow"/"Unfollow")
const [following,setFollowing] = useState([])
const UID = parseInt(localStorage.getItem("UID")) 
const JWT = localStorage.getItem("JWT")
const nav = useNavigate()
useEffect(()=>{
        fetch(`/user/${UID}`,{
            headers: {
                "Authorization":`Bearer ${JWT}`
            }
        }).then(resp => {
            if (resp.ok){
                resp.json().then(data =>{
                    if(data.following[0]){
                        data.following.forEach(f =>{
                            console.log(f.following)
                            if(!(following.includes(f.following.username))){
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
            <UserCard key={f.following.id} f={f} UID={UID} following={following} self={self} close={closeFollowing} choice={'following'} JWT={JWT}/>
          ))}
        </div>
      )}
      else if(showingFollowers){ return (
        <div className="profile-page">
          <h1>Followers</h1>
          <button className='back' onClick={closeFollowers}>Back</button> 
          {profileData.followers.map(f => (
            <UserCard key={f} f={f} UID={UID} following={following} self={self} close={closeFollowers} choice={'follower'} JWT={JWT}/>
          ))}
        </div>
      )}
}
export default UserCards