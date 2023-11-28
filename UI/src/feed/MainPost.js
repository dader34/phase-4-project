import Modal from 'react-modal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../STYLING/MainPost.css'
const MainPost = ({author, content, date, likes, id, views}) =>{
  const UID = parseInt(localStorage.getItem("UID"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const nav = useNavigate();

  // Set liked to true if self UID is in likes array
  const [likeAmt, setLikeAmt] = useState(likes.length);
  const [liked, setLiked] = useState(likes.some(like => like.id === UID));

  const openModal = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const closeModal = (e) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };

  const handleComment = (e) => {
    // Handle comment submission logic
    console.log('Comment submitted:', commentText);

    closeModal(e);
  };

  const handleLike = (e) => {
    e.stopPropagation();
    // Make post request to like/unlike
    // Get back response # of likes
    if (liked) {
      setLikeAmt(current => current - 1);
      setLiked(false);
    } else {
      setLikeAmt(current => current + 1);
      setLiked(true);
    }
  };

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
            <button className="like-button" onClick={handleLike}>👍</button>
            <span className="likes-counter">{likeAmt}</span>
          </div>
          <button className="comment-button" onClick={openModal}>💬</button>
        </div>
        <div className="additional-info">
          <span className="views">{Math.round(views)} views</span>
          <span className="date">{formattedDate}</span>
        </div>
      </div>
      <div onClick={(e) => e.stopPropagation()} className='click-div'>
      <Modal style={{content:{"borderRadius":"15px","padding":"30px","overflow":"hidden"}}}
        isOpen={isModalOpen}
        ariaHideApp={false}
        onRequestClose={closeModal}
        contentLabel="Comment Modal"
      >
        <textarea 
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="What is happening?!"
          className='modal-input'
        />
        <button onClick={handleComment} className='post-button'>Post</button>
        <button onClick={closeModal} className='close-button'>X</button>
      </Modal>
    </div>
    </div>
  );
}
export default MainPost