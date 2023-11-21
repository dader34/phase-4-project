import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import '../STYLING/BioAndPfp.css';


const BioAndPfp = () => {
  const [imagePreview, setImagePreview] = useState(null);

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
        const response = await fetch('https://backend.danner.repl.co/upload', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error(error);
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

  const handleSubmit = e => {
    e.preventDefault();
    if (formik.isValid) {
      formik.handleSubmit();
    }
  };

  return (
    <div className="page-container">
      <div className="logo-container">
        <img src="/Flatironschool.jpg" alt="Logo" className="logo" />
      </div>
      <div className="header">
        <h1>Welcome to BirdNoise! Please Upload a Profile Picture to Get Started!</h1>
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
            <label htmlFor="file" className="file-input-label">Choose a file</label>
            <label htmlFor="bio" className="bio-prompt">Please add a bio for your profile!</label>
            <textarea 
              onChange={formik.handleChange} 
              onBlur={formik.handleBlur}
              value={formik.values.bio}
              name="bio" 
              className="bio-textarea"
            />
          </div>
          <button type="submit" className="submit-button">Submit</button>
        </form>
      </div>
    </div>
  );  
};

export default BioAndPfp;
