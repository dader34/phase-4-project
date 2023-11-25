import '../STYLING/MainPost.css'
const MainPost = ({author, content, date, views, likes}) =>{
    const tz = new Intl.DateTimeFormat().resolvedOptions().timeZone
    const formattedDate = new Date(`${date} UTC`).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: tz, // Set the desired time zone
    });


     return (
    <div className="user">
      <div className="user-pfp">
        <img src={author.profile_picture} alt={author.name} />
      </div>
      <p className="post-body">{content}</p>
      <div className="info-container">
        <div className="buttons-container">
          <div>
            <button className="like-button">👍</button>
            <span className="likes-counter">{likes}</span>
          </div>
          <button className="comment-button">💬</button>
        </div>
        <div className="additional-info">
          <span className="views">{Math.round(views)} views</span>
          <span className="date">{formattedDate}</span>
        </div>
      </div>
    </div>
  );
}
export default MainPost