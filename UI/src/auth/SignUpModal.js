import React, { useState } from 'react';
import '../STYLING/Modal.css';
import {useNavigate} from 'react-router-dom'
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

const SignUpModal = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [detailsConfirmed, setDetailsConfirmed] = useState(false);
  const nav = useNavigate()

  const handleSignUpDetails = async(e) => {
    e.preventDefault();
    await formik.submitForm()

    const errors = await formik.validateForm();
    
    const errorKeys = Object.keys(errors)

    if (Object.keys(errors).length > 0) {
      toast.error(errors[errorKeys[0]])
    }
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    if (detailsConfirmed) {
      // Implement sign-up logic to store user in the database
      nav('/signup/complete')
      //Make Post req to backend, store tokens, and on after signup make patch to db for pfp and bio
      // onClose(); // Uncomment this line to close the modal after sign up
    }
  };

  const formik = useFormik({
    initialValues:{
      name: '',
      password: '',
      passwordConfirm: ''
    },
    validationSchema: Yup.object({
      name: Yup.string().min(5, "Username must be at least 5 characters").max(15, "Username has to be 15 characters or less").required("Username is required"),
      password: Yup.string().min(5, "Password must be at least 5 characters").max(15, "Password has to be 15 characters or less").required("Password is required"),
      passwordConfirm: Yup.string().test('passwords-match', 'Passwords must match',(value) => value === formik.values.password).required("Passwords must match")
    }),
    onSubmit: (values) =>{
      setStep(2)
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
          {step === 1 && (
            <form onSubmit={handleSignUpDetails}>
              <h2>Create your account</h2>
              <label htmlFor="name" className="helperText">Username</label>
              <input
                id="name"
                type="text"
                onChange={(e) => formik.setFieldValue('name',e.target.value)}
                required
                className="modalInput"
              />
              <label htmlFor="password" className="helperText">Password</label>
              <input
                id="password"
                type="password"
                onChange={(e) => formik.setFieldValue('password',e.target.value)}
                required
                className="modalInput"
              />
              <label htmlFor="confirmPassword" className="helperText">Confirm Password</label>
              <input
                id="confirmPassword"
                type="password"
                onChange={(e) => formik.setFieldValue('passwordConfirm',e.target.value)}
                required
                className={`modalInput`}
              />

              <button type="submit" className="modalButton">Next</button>
            </form>
          )}
          {step === 2 && (
            <div>
              <h2>Step 2 of 2</h2>
              <p>Please confirm your details and proceed to create your account.</p>
              <ul>
                <li>Username: {formik.values.name}</li>
              </ul>
              <label>
                <input
                  type="checkbox"
                  checked={detailsConfirmed}
                  onChange={(e) => setDetailsConfirmed(e.target.checked)}
                />
                Confirm Details
              </label>
              <input 
                onClick={handleSignUp} 
                type='submit'
                className={`modalButton ${!detailsConfirmed ? 'buttonDisabled' : ''}`}
                disabled={!detailsConfirmed}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignUpModal;