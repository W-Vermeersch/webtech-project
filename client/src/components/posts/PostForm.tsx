import { Formik, Form, Field } from "formik";
import { FormGroup, FormLabel, Button } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import "./PostForm.css";

const animalTags = ["Cat", "Dog", "Lion"];


const PostForm = () => {

  return (
    <Formik
      initialValues={{
        caption: "",
        file: null,
        tags: [],
      }}
      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          console.log("Form data:", values);
          setSubmitting(false);
        }, 400);
      }}
    >
      {({ setFieldValue, values, isSubmitting }) => (
        
        
        <Form className="p-4 shadow rounded bg-light w-75 mx-auto">
          {/* Caption field */}
          <FormGroup className="mb-4" controlId="formCaption">
            <FormLabel>Caption</FormLabel>
            <Field
              as="textarea"
              name="caption"
              rows={4}
              className="form-control"
              placeholder="Write your caption here"
            />
          </FormGroup>

          {/* Upload a file */}
          <FormGroup className="mb-4 file-upload" controlId="formFile">
            <FormLabel>Add photo</FormLabel>
            <input
              type="file"
              name="file"
              accept="image/*"
              className="form-control"
              onChange={(event) => {
                if (event.currentTarget.files) {
                  setFieldValue("file", event.currentTarget.files[0]);
                }
              }}
            />
          </FormGroup>

          {/* Tags field */}
          <FormGroup className="mb-4" controlId="formTags">
            <FormLabel>Animal Tags</FormLabel>
            <Typeahead
              options={animalTags}
              placeholder="Lion, Cat, Pigeon, ..."
              multiple
              allowNew // Enables custom tags
              id="animaltags"
              onChange={(selected) => setFieldValue("tags", selected)}
              selected={values.tags}
            />
          </FormGroup>

          {/* Buttons */}
          <div className="d-flex justify-content-between">
            <Button variant="dark" type="submit" disabled={isSubmitting}>
              Post
            </Button>
            <Button
              variant="outline-secondary"
              type="reset"
              onClick={() => {
                setFieldValue("caption", "");
                setFieldValue("file", null);
                setFieldValue("tags", []);
              }}
            >
              Cancel
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PostForm;
