// Import react-modal at the beginning of your file
import Modal from 'react-modal';
import { useState } from 'react';
import '../STYLING/PostCard.css';

const PostCard = ({ author, content, date, likes }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState('');

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleComment = () => {
    // Handle comment submission logic
    console.log('Comment submitted:', commentText);

    closeModal();
  };

  return (
    <div className="post-container">
      <div className="user-pfp">
        <img src={author.profile_picture} alt={author.name} />
      </div>
      <p className="post-body">{content}</p>
      <div className="buttons-container">
        <div>
          <button className="like-button">👍</button>
          <span className="likes-counter">{likes}</span>
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
