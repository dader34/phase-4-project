// Import react-modal at the beginning of your file
import Modal from 'react-modal';
import { useState } from 'react';
import useClipboard from "react-use-clipboard";
import { useNavigate } from 'react-router-dom';
import { FaShare } from 'react-icons/fa';
import '../STYLING/PostCard.css';
import toast from 'react-hot-toast';
// import 'react-quill/dist/quill.snow.css';

const PostCard = ({ author, content, date, likes, id, views, comments }) => {
  const UID = parseInt(localStorage.getItem("UID"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const nav = useNavigate();
  const [isCopied, setCopied] = useClipboard(`http://127.0.0.1:3000/home/post/${id ? id : undefined}`)

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
  // console.log(comments)
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

  const handleShare = (e) => {
    e.stopPropagation();
    // Implement your logic for sharing here
    setCopied()
    toast.success("Copied!")
  };

  const tz = new Intl.DateTimeFormat().resolvedOptions().timeZone
  const formattedDate = new Date(`${date} UTC`).toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    day: 'numeric',
    year: 'numeric',
    month: 'short',
    hour12: true,
    timeZone: tz 
  });


  return (
    <div className="post-container" onClick={() => {
      id && nav(`/home/post/${id}`) 
    }}>
      <div className="user-pfp">
        <img src={author.profile_picture} alt={author.name} />
      </div>
      <span className="username">@{author.name}</span>
      <p className="post-body">{content}</p>
      <div className="info-container">
        <div className="buttons-container">
          <div>
            <button className="like-button" onClick={handleLike}>👍  {likeAmt}</button>
            {/* <span className="likes-counter">{likeAmt}</span> */}
          </div>
          <button className="comment-button" onClick={openModal}>
           💬 {comments && comments.length}
          </button>
          <span className="material-symbols-outlined" onClick={handleShare}>
          ios_share
          </span>
        </div>
        <div className="additional-info">
          <span className="views">{Math.round(views)} views</span>
          <span className="date">{formattedDate}</span>
        </div>
      </div>

      {/* Modal */}
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
};

export default PostCard;
