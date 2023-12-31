import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {useNavigate} from 'react-router-dom';
import '../STYLING/BioAndPfp.css';
import toast from 'react-hot-toast';



const BioAndPfp = () => {
  const [imagePreview, setImagePreview] = useState(null);
  const nav = useNavigate()
  const JWT = localStorage.getItem("JWT")
  const formik = useFormik({
    initialValues: {
      file: null,
      bio: '',
    },
    validationSchema: Yup.object({
      file: Yup.mixed()
        .required('File is required'),
      bio: Yup.string()
        .min(1, 'Bio must be at least 1 character long')
        .required('Bio is required'),
    }),
    onSubmit: async (values) => {
      // Handle form submission logic here
      console.log('Form values:', values);
      const formData = new FormData();
      formData.append('file', values.file);
    
      try {
        // Wrap the asynchronous operation with toast.promise
        await toast.promise(
          fetch('https://backend.danner.repl.co/upload', {
            method: 'POST',
            body: formData,
          })
          .then(response => response.json())
          .then(data => {
              const imgurl = data
              fetch(`/signup`,{
              method:"PATCH",
              headers:{
                "Content-Type":"application/json",
                "Authorization": `Bearer ${JWT}`
              },
              body:JSON.stringify({
                "pfp":imgurl.blob_link,
                "bio":formik.values.bio
              })
            })
            .then(resp => resp.json())
            .catch(e => {toast.error(e.message);nav('/home')})
          }),
          {
            loading: 'Uploading...',
            success: 'Success!',
            error: 'Submission failed',
          }
        );
    
        // Navigate to '/home' after successful submission
        nav('/home');
      } catch (error) {
        toast.error(error)
      }
    },
  });

  const handleImageChange = event => {
    const file = event.currentTarget.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      formik.setFieldValue('file', file);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    
    await formik.submitForm();

    const errors = await formik.validateForm();
    
    const errorKeys = Object.keys(errors)

    if (Object.keys(errors).length > 0) {
      toast.error(errors[errorKeys[0]])
    }
  };

  return (
    <div className="page-container">
      <div className="logo-container">
        <img src="/birdnoise.png" alt="Logo" className="logo" />
      </div>
      <div className="header">
        <h1>Complete your profile</h1>
      </div>
      <div className="upload-section">
        <form onSubmit={handleSubmit} className="upload-form">
          <h2>Profile Photo Preview</h2>
          {imagePreview && <img src={imagePreview} alt="Preview" className="image-preview" />}
          <div className="file-input-container">
            <input
              type="file"
              id="file"
              className="custom-file-input"
              name="file"
              accept=".png, .heif, .jpg, .jpeg, .webp, .heic"
              onChange={handleImageChange}
            />
            <label htmlFor="bio" className="bio-prompt">Tell us something about you! </label>
            <textarea 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur}
              value={formik.values.bio}
              // placeholder='Tell us something about you!'
              name="bio" 
              className="bio-textarea"
            />
            <button type="submit" className="submit-button">Submit</button>
          </div>
          
        </form>
      </div>
    </div>
  );  
};

export default BioAndPfp;
