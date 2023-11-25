import '../STYLING/MainPost.css'
const MainPost = ({author, content, date, likes}) =>{
    return(
        <div className="user">
            <div className="user-pfp">
            <img src={author.profile_picture} alt={author.name} />
        </div>
        <p className="post-body">{content}</p>
        <div className="buttons-container">
            <div>
            <button className="like-button">👍</button>
            <span className="likes-counter">{likes}</span>
            </div>
            <button className="comment-button" >
            💬
            </button>
        </div>
        </div>
    )
}
export default MainPost