// Import react-modal at the beginning of your file
import Modal from 'react-modal';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import '../STYLING/PostCard.css';

const PostCard = ({ author, content, date, likes, id }) => {
    const UID = parseInt(localStorage.getItem("UID"))
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [commentText, setCommentText] = useState('');
    const nav = useNavigate()
    //  Set liked to true if self uid is in likes array
    const [likeAmt,setLikeAmt] = useState(likes.length)
    const [liked, setLiked] = useState(likes.filter(like => like.id === UID))

  const openModal = (e) => {
    e.stopPropagation()
    setIsModalOpen(true);
  };

  const closeModal = (e) => {
    e.stopPropagation()
    setIsModalOpen(false);
  };

  const handleComment = () => {
    // Handle comment submission logic
    console.log('Comment submitted:', commentText);

    closeModal();
  };

  const handleLike = (e) =>{
    e.stopPropagation()
    //Make post request to like/unlike
    //get back response # of likes
    if(liked){
        setLiked(false)
        setLikeAmt(current => current - 1)
    }else{
        setLiked(true)
        setLikeAmt(current => current + 1)
    }
  }

  return (
    <div className="post-container" onClick={() => nav(`/post/${id}`)}>
      <div className="user-pfp">
        <img src={author.profile_picture} alt={author.name} />
      </div>
      <p className="post-body">{content}</p>
      <div className="buttons-container">
        <div>
          <button className="like-button" onClick={handleLike}>👍</button>
          <span className="likes-counter">{likeAmt}</span>
        </div>
        <button className="comment-button" onClick={openModal}>
          💬
        </button>
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        ariaHideApp={false}
        onRequestClose={closeModal}
        contentLabel="Comment Modal"
      >
        <textarea
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Type your comment..."
        />
        <button onClick={handleComment}>Submit Comment</button>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </div>
  );
};

export default PostCard;
