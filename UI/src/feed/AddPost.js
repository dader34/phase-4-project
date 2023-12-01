import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

const AddPost = () => {
    const UID = parseInt(localStorage.getItem("UID"));
    const JWT = localStorage.getItem("JWT")
    const nav = useNavigate()

    const formik = useFormik({
        initialValues: {
            content: ''
        },
        validationSchema: Yup.object({
            content: Yup.string().min(2, "Post must be at least 2 characters").max(300, "Post can't be more than 300 characters").required("Post must have text")
        }),
        onSubmit: async values => {
            fetch('https://birdnoise.danner.repl.co/post', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${JWT}`
                },
                body: JSON.stringify({
                    'user_id': UID,
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

    const handlePostSubmit = async e =>{
        e.preventDefault()
        await formik.submitForm()

        const errors = await formik.validateForm();
    
        const errorKeys = Object.keys(errors)

        if (Object.keys(errors).length > 0) {
        toast.error(errors[errorKeys[0]])
        }
    }


    return (
        <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', marginBottom: '16px', textAlign: 'center' }}>
            <form onSubmit={handlePostSubmit}>
                <textarea
                    value={formik.values.content}
                    onChange={e => formik.setFieldValue('content',e.target.value)}
                    placeholder="Make some noise!!"
                    style={{ width: '100%', height: '125px', boxSizing: 'border-box', border: '1px solid #ccc', borderRadius: '4px', padding: '10px', marginBottom: '15px' }}
                />
                <p>Characters: {formik.values.content.length}</p>
                <input type='submit' value='Post' style={{ backgroundColor: '#1DA1F2', color: '#fff', padding: '10px', border: 'none', borderRadius: '4px', cursor: 'pointer', width: '30%' }}/>
            </form>
        </div>
    );
};

export default AddPost;
