// Import react-modal at the beginning of your file
import Modal from 'react-modal';
import { useEffect, useState } from 'react';
import useClipboard from "react-use-clipboard";
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import '../STYLING/PostCard.css';
import toast from 'react-hot-toast';
// import 'react-quill/dist/quill.snow.css';

const PostCard = ({ author, content, date, likes, id, views, comments, parent_id }) => {
  const UID = parseInt(localStorage.getItem("UID"));
  const JWT = localStorage.getItem("JWT")
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [likeAmt, setLikeAmt] = useState(likes.length);
  // Set liked to true if self UID is in likes array
  // const [liked, setLiked] = useState(likes.some(like => like.id === UID));
  const nav = useNavigate();
  const [_, setCopied] = useClipboard(`http://127.0.0.1:3000/home/post/${id}`)

  useEffect(()=>{
    (UID || JWT)&& 
      fetch("http://127.0.0.1:5555/auth",{
          headers:{
              "Authorization": `Bearer ${JWT}`
          }
      })
      .then(resp => resp.json())
      .then(data => {
          if(!(data && data.success)){
              nav('/')
              toast.error("Your session has expired, please log in again")
          }
      })
  },[])

  const formik = useFormik({
    initialValues: {
      content: ''
    },
    validationSchema: Yup.object({
      content: Yup.string().min(2, "Post must be at least 2 characters").max(300, "Post can't be more than 300 characters").required("Post must have text")
    }),
    onSubmit: async values => {
      fetch('http://127.0.0.1:5555/post', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${JWT}`
        },
        body: JSON.stringify({
          'user_id': UID,
          parent_id: id,
          content: formik.values.content
        })
      })
        .then(resp => {
          if (resp.ok) {
            resp.json()
              .then(data => {
                if (data) {
                  nav(`/home/post/${data.id}`)
                }
              })
          } else {
            resp.json()
              .then(data => { throw new Error(data[Object.keys(data)[0]]) })
              .catch(error => {
                toast.error(error.message);
              });
          }
        })
        .catch(e => toast.error(e.message))

    }

  })

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    try {
      await toast.promise(
        formik.submitForm(),
        {
          loading: 'Submitting post...',
          success: 'Post submitted successfully!',
          error: (error) => `Error: ${error.message}`,
        }
      );
  
      closeModal(e);
    } catch (error) {
      // Handle other errors, if needed
      console.error('Error submitting post:', error);
    }
  };




  const openModal = (e) => {
    e.stopPropagation();
    setIsModalOpen(true);
  };

  const closeModal = (e) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };


  // console.log(comments)
  const handleLike = (e) => {
    e.stopPropagation();
    // Make post request to like/unlike
    // Get back response # of likes
    fetch('http://127.0.0.1:5555/like', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${JWT}`
      },
      body: JSON.stringify({
        'user_id': UID,
        'post_id': id
      })
    }).then(resp => resp.json())
      .then(data => setLikeAmt(data.likes))
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
        <img src={author.profile_picture} alt={author.name} onError={({ currentTarget }) => { (currentTarget.src = 'https://merriam-webster.com/assets/mw/images/article/art-wap-landing-mp-lg/egg-3442-4c317615ec1fd800728672f2c168aca5@1x.jpg') }} />
      </div>
      <span className="username">@{author.name}</span>
      <p className="post-body">{content}</p>
      <div className="info-container">
        {(UID && JWT) ? <div className="buttons-container">
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
        </div> : ""}
        <div className="additional-info">
          <span className="views">{Math.round(views)} views</span>
          <span className="date">{formattedDate}</span>
        </div>
      </div>

      {/* Modal */}
      <div onClick={(e) => e.stopPropagation()} className='click-div'>
        <Modal style={{ content: { "borderRadius": "15px", "padding": "30px", "overflow": "hidden" } }}
          isOpen={isModalOpen}
          ariaHideApp={false}
          onRequestClose={closeModal}
          contentLabel="Comment Modal"
        >
          <form onSubmit={handlePostSubmit}>
            <textarea
              value={formik.values.content}
              onChange={(e) => formik.setFieldValue('content', e.target.value)}
              placeholder="What is happening?!"
              className='modal-input'
            />
            <p>Characters: {commentText.length}</p>
            <input type='submit' value='post' className='post-button' />
            <button onClick={closeModal} className='close-button'>X</button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default PostCard;
