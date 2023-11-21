import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const BioAndPfp = () => {
  const handleSubmit = (e) =>{
    e.preventDefault()
    //Formik errors handle right here until further notice
    console.log(formik.errors)
    formik.handleSubmit()

  }

  const formik = useFormik({
    initialValues: {
      file: null,  // Updated to null to match the file type in the schema
      bio: '',
    },
    validationSchema: Yup.object({
      file: Yup.mixed()
        .required('File is required')
        .test(
          'fileType',
          'Invalid file type. Only images are allowed.',
          (value) => {
            if (!value || !value[0]) {
              return true;
            }

            const allowedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'];
            const fileNameWithExtension = value.name;
            const fileExtension = fileNameWithExtension.split('.').pop().toLowerCase();
            console.log(fileExtension);
            return allowedExtensions.includes(fileExtension);
          }
        ),
      bio: Yup.string()
        .min(1, 'Bio must be at least 1 character long')
        .required('Bio is required'),
    }),
    onSubmit: async (values) => {
      // Handle form submission logic here
      if(formik.errors)
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

  return (
    <form onSubmit={handleSubmit}>
      <h2>File Upload Example</h2>
      <input
        type="file"
        className="custom-file-input"
        name="file"
        accept=".png, .heif, .jpg, .jpeg, .webp, .heic"
        onChange={(event) => {
          const file = event.currentTarget.files[0];
          formik.setFieldValue('file', file);
        }}
      />

      <textarea onChange={(e) => formik.setFieldValue('bio',e.target.value)} style={{ resize: 'none' }} name="bio" />

      <button type="submit">Submit</button>
    </form>
  );
};

export default BioAndPfp;
