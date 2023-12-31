import React from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup';
import '../STYLING/Modal.css';
import toast from 'react-hot-toast';

const SignInModal = ({ onClose }) => {
  const nav = useNavigate()

  const handleSubmit = async(e) => {
    e.preventDefault();
    await formik.submitForm()

    const errors = await formik.validateForm();
    
    const errorKeys = Object.keys(errors)

    if (Object.keys(errors).length > 0) {
      toast.error(errors[errorKeys[0]])
    }
  };

  const formik = useFormik({
    initialValues: {
      name: '',
      password: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().min(5, "Username must be at least 5 characters").max(15, "Username has to be 15 characters or less").required("Username is required"),
      password: Yup.string().min(5, "Password must be at least 5 characters").max(15, "Password has to be 15 characters or less").required("Password is required")
    }),
    onSubmit: async (values) => {
      // Use toast.promise to wrap the asynchronous operation
      await toast.promise(
        fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "username": values.name,
            "password": values.password
          })
        })
        .then(resp => {
          if (!resp.ok) {
            return resp.json().then(data => Promise.reject(new Error(data[Object.keys(data)[0]])));
          }
          return resp.json();
        })
        .then(data => {
          localStorage.setItem("UID", data.UID);
          localStorage.setItem("JWT", data.JWT);
          return "Logged in!";
        }),
        {
          pending: "Logging in...",
          success: "Successfully logged in!",
          error: "Login failed"
        }
      );
  
      // Navigate to '/home' after successful submission
      nav('/home');
    }
  });

  return (
    <div className="modalOverlay">
      <div className="modalContainer">
        <div className="dark-mode modalHeader">
          <img src="/birdnoise.png" alt="Flatiron School Logo" className="modalIcon" />
          <button onClick={onClose} className="closeButton">&times;</button>
        </div>
        <div className="dark-mode modalBody">
          <form onSubmit={handleSubmit}>
            <h2>Sign in to BirdNoise</h2>
            <label htmlFor="username" className="helperText">Username</label>
            <input
              id="username"
              type="text"
              onChange={(e) => formik.setFieldValue('name',e.target.value)}
              required
              autoComplete="username"
              className={`dark-mode modalInput`}
            />
            <label htmlFor="password" className="helperText">Password</label>
            <input
              id="password"
              type="password"
              onChange={(e) => formik.setFieldValue('password',e.target.value)}
              required
              autoComplete="current-password"
              className={`dark-mode modalInput`}
            />
            <input type="submit" className="modalButton"/>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignInModal;
 