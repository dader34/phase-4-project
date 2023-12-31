// Import react-modal at the beginning of your file
import Modal from 'react-modal';
import { useState } from 'react';
import useClipboard from "react-use-clipboard";
import { useLocation, useNavigate, useOutletContext } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import '../STYLING/PostCard.css';
import toast from 'react-hot-toast';
// import 'react-quill/dist/quill.snow.css';

const PostCard = ({ author, content, date, likes, id, views, comments,user_id, remove }) => {
  const UID = parseInt(localStorage.getItem("UID"));
  const JWT = localStorage.getItem("JWT")
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [likeAmt, setLikeAmt] = useState(likes.length);
  const location = useLocation()
  const [isDark] = useOutletContext()
  const nav = useNavigate();
  const [_, setCopied] = useClipboard(`http://127.0.0.1:3000/home/post/${id}`)// eslint-disable-line

  const handleDelete = (event) => {
    event.stopPropagation();
    if (window.confirm('Are you sure you want to delete this post?')) {
      fetch(`/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${JWT}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to delete the post.');
        }
        return response.json();
      })
      .then(() => {
        toast.success('Post deleted successfully');
        if(remove){
          remove(id)
        }
        nav('/home');
      })
      .catch(error => {
        toast.error(error.message);
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      content: ''
    },
    validationSchema: Yup.object({
      content: Yup.string().min(2, "Post must be at least 2 characters").max(300, "Post can't be more than 300 characters").required("Post must have text")
    }),
    onSubmit: async values => {
      fetch('/post', {
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
      toast.error(e.message)
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


  const handleLike = (e) => {
    e.stopPropagation();
    // Make post request to like/unlike
    // Get back response # of likes
    fetch('/like', {
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
      id && !location.pathname.endsWith(`/post/${id}`) && nav(`/home/post/${id}`)
    }}>
      <div className="user-pfp" onClick={(e) => { e.stopPropagation(); nav(`/home/profile/${user_id}`) }}>
        <img src={author.profile_picture} alt={author.name} onError={({ currentTarget }) => {
          currentTarget.src = 'https://merriam-webster.com/assets/mw/images/article/art-wap-landing-mp-lg/egg-3442-4c317615ec1fd800728672f2c168aca5@1x.jpg';
        }} />
      </div>
      <span className="username">@{author.name}</span>
      <p className="post-body">{content}</p>
      <div className="info-container">
        <div className="buttons-container">
          <div>
            <button className="like-button" onClick={(e) => {
              e.stopPropagation();
              (UID && JWT) && handleLike(e);
            }}>👍 {likeAmt}</button>
          </div>
          <button className="comment-button" onClick={(e) => {
            e.stopPropagation();
            (UID && JWT) && openModal(e);
          }}>
            💬 {comments && comments.length}
          </button>
          <span className="material-symbols-outlined" onClick={(e) => {
            e.stopPropagation();
            handleShare();
          }}>
            ios_share
          </span>
        </div>
        <div className="additional-info">
          <span className="views">{Math.round(views)} views</span>
          <span className="date">{formattedDate}</span>
        </div>
      </div>
      {/* Conditionally render the delete button */}
      {UID === user_id && (
        <button className="delete-post-button" onClick={(e) => {
          e.stopPropagation();
          handleDelete(e);
        }}>
          Delete Post
        </button>
      )}
      {/* Modal */}
      <div onClick={(e) => e.stopPropagation()} className='click-div'>
        <Modal isOpen={isModalOpen}
          ariaHideApp={false}
          onRequestClose={(e) => {
            e.stopPropagation();
            closeModal();
          }}
          contentLabel="Comment Modal"
          style={{
            content: {
              borderRadius: "15px",
              padding: "30px",
              overflow: "hidden",
              background: isDark ? "#494f55" : 'white',
              color: isDark ? "white" : 'black'
            }
          }}
        >
          <form onSubmit={handlePostSubmit}>
            <textarea
              value={formik.values.content}
              onChange={(e) => formik.setFieldValue('content', e.target.value)}
              placeholder="What is happening?!"
              className='modal-input'
            />
            <p>Characters: {formik.values.content.length}</p>
            <input type='submit' value='post' className='post-button' />
            <button onClick={(e) => {
              e.stopPropagation();
              closeModal(e);
            }} className='close-button'>X</button>
          </form>
        </Modal>
      </div>
    </div>
  );
};

export default PostCard;
