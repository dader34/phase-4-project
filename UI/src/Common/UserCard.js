import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const UserCard = ({ f, UID, JWT, following,self,close,choice }) => {
    const [isFollowing,setIsFollowing] = useState(following.includes(f[choice].username))
    const nav = useNavigate()

    const handleFollow = (id) =>{
        fetch(`/follow/${id}`,{
            method:"POST",
            headers:{
                "Authorization":`Bearer ${JWT}`
            }
        })
        .then(resp => resp.json())
        .then(data => setIsFollowing(data['status'] === "Unfollow" ? true : false ))
    }
    useEffect(()=>{
        setIsFollowing(following.includes(f[choice].username))
    },[following,choice,f])

    return(
        <div key={f[choice].id} className="follower-item" >
            <img className="follower-picture" src={f[choice].profile_picture} alt={f[choice].username} style={{ cursor: "pointer" }} onClick={() => { close(); nav(`/home/profile/${f[choice].id}`) }} />
            <div className="follower-info">
                <h3 className="follower-username">{f[choice].username}</h3>
                {!(parseInt(f[choice].id) === UID) && <button className="follow-button" onClick={() => handleFollow(f[choice].id)}>{self ? 'Unfollow' : (isFollowing ? 'Unfollow' : 'Follow')}</button>}
            </div>
        </div>
    )
}

export default UserCard