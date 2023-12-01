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
      try {
        const resp = await fetch("/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "username": formik.values.name,
            "password": formik.values.password
          })
        });
  
        if (!resp.ok) {
          const data = await resp.json();
          throw new Error(data[Object.keys(data)[0]]);
        }
  
        const data = await resp.json();
        localStorage.setItem("UID", data.UID);
        localStorage.setItem("JWT", data.JWT);
  
        await toast.promise(
          Promise.resolve("Logged in!"),
          {
            pending: "Logging in...",
            success: "Successfully logged in!",
            error: "Login failed"
          }
        );
  
        nav('/home');
      } catch (error) {
        // Use toast.promise for errors
        toast.error(error)
      }
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
 