import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const FileUpload = () => {
  return (
    <Formik
      initialValues={{
        file: '',
        bio: '',
      }}
      validationSchema={Yup.object({
        file: Yup.mixed()
          .required('File is required')
          .test(
            'fileType',
            'Invalid file type. Only images are allowed.',
            (value) => {
              if (!value || !value[0]) {
                return true;
              }

              const allowedTypes = [
                'image/jpeg',
                'image/png',
                'image/jpg',
                'image/webp',
                'image/heic',
                'image/heif',
              ];
              return allowedTypes.includes(value[0].type);
            }
          ),
        bio: Yup.string()
          .min(1, 'Bio must be at least 1 character long')
          .required('Bio is required'),
      })}
      onSubmit={async (values) => {
        // Handle form submission logic here
        console.log('Form values:', values);
        const formData = new FormData();
        formData.append('file', values.file[0]);

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
      }}
    >
      <Form>
        <h2>File Upload Example</h2>
        <Field
          type="file"
          className="custom-file-input"
          name="file"
          accept=".png, .heif, .jpg, .jpeg, .webp, .heic"
        />
        {/* Handle validation errors here @ michael     vvvvvvvv     */}
        <ErrorMessage name="file" render={(msg) => console.log(msg)} />

        <Field
          as="textarea"
          style={{ resize: 'none' }}
          name="bio"
        />
       {/* Handle validation errors here @ michael     vvvvvvvv     */}
        <ErrorMessage name="bio" render={msg => console.log(msg)} />

        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
};

export default FileUpload;
