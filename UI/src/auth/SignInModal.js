import React, { useState } from 'react';
import { Formik, useFormik } from 'formik';
import * as Yup from 'yup';
import '../STYLING/Modal.css';

const SignInModal = ({ onClose, onSignIn }) => {
  const [step, setStep] = useState(1);


  const handleSubmit = (e) => {
    e.preventDefault();
    formik.handleSubmit()
    if (formik.errors) {
      console.log(formik.errors)
    }
  };


  const formik = useFormik({
    initialValues:{
      name: '',
      password: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().min(5, "Username must be at least 5 characters").max(15, "Username has to be 15 characters or less").required("Username is required"),
      password: Yup.string().min(5, "Password must be at least 5 characters").max(15, "Password has to be 15 characters or less").required("Password is required")
    }),
    onSubmit: (values) =>{
      // TODO: Check if the user exists in your database
      console.log("Post to login")
      //Post to login then get auth and redirect to feed
      //If user doesnt exist send alert back

    }
  })

  return (
    <div className="modalOverlay">
      <div className="modalContainer">
        <div className="modalHeader">
          <img src="/birdnoise.png" alt="Flatiron School Logo" className="modalIcon" />
          <button onClick={onClose} className="closeButton">&times;</button>
        </div>
        <div className="modalBody">
          <form onSubmit={handleSubmit}>
            <h2>Sign in to BirdNoise</h2>
            <label htmlFor="username" className="helperText">Username</label>
            <input
              id="username"
              type="text"
              onChange={(e) => formik.setFieldValue('name',e.target.value)}
              required
              autoComplete="username"
              className={`modalInput`}
            />
            <label htmlFor="password" className="helperText">Password</label>
            <input
              id="password"
              type="password"
              onChange={(e) => formik.setFieldValue('password',e.target.value)}
              required
              autoComplete="current-password"
              className={`modalInput`}
            />
            <input type="submit" className="modalButton"/>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
 