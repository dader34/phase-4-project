import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom'
import * as Yup from 'yup';
import '../STYLING/Modal.css';
import toast from 'react-hot-toast';

const SignInModal = ({ onClose, onSignIn }) => {
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
      fetch("/login",{
        method:"POST",
        headers:{
          "Content-Type":"application/json"
        },
        body:JSON.stringify({"username":formik.values.name,"password":formik.values.password})
      })
      .then(resp => {
        if (resp.ok) {
          resp.json()
          .then(data => {if(data){
            console.log(data);
            localStorage.setItem("UID", data.UID);
            localStorage.setItem("JWT", data.JWT);
            toast.success("Logged in!");
            nav('/home')
            // Redirect or perform other actions after successful login
          }})
        } else {
          resp.json()
          .then(data =>{throw new Error(data[Object.keys(data)[0]])})
          .catch(error => {
            toast.error(error.message);
          });
        }
      })
      .catch(e => toast.error(e.message))
     
      // .then(() => nav('/home'))
      // toast.success("Logged in!")
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
 