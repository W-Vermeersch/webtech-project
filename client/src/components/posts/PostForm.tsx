import { Formik, Form, Field, FormikHelpers } from "formik";
import { useNavigate } from "react-router-dom";
import { FormGroup, Button } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import FileUploader from "./FileUploader";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ADD_POST } from "../../api/urls";
import useAuthUser from "../../hooks/useAuthUser";

interface PostFormValues {
  caption: string;
  file: string;
  tags: string[];
}

const animalTags: string[] = ["Cat", "Dog", "Lion"];

const PostForm = () => {
  const axios = useAxiosPrivate();
  const navigate = useNavigate();
  const user = useAuthUser();

  const initialValues: PostFormValues = {
    caption: "",
    file: "",
    tags: [],
  };

  async function onSubmit(
    values: PostFormValues,
    actions: FormikHelpers<PostFormValues>
  ) {
    console.log("Form data:", values);
    const formData = new FormData();
    formData.append('file', values.file); // Attach the file
    formData.append('caption', values.caption);
    formData.append('tags', values.tags[0]);
    try {
      const resp = await axios.post(ADD_POST, values, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }});
      console.log("Response:", resp.data);
      navigate(`/profile/${user?.username}`);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      actions.setSubmitting(false);
    }
  }

  return (
    <Formik type initialValues={initialValues} onSubmit={onSubmit}>
      {({ setFieldValue, values, isSubmitting }) => (
        <Form className="p-4 shadow rounded bg-light w-75 mx-auto">
          <FormGroup className="mb-4 " controlId="reactFile">
            <p className="dropzone-title">
              Drag and drop some files here, or click to select files
            </p>
            <FileUploader setFieldValue={setFieldValue} />
          </FormGroup>

          {/* Caption field */}
          <FormGroup className="mb-4" controlId="formCaption">
            Caption
            <Field
              as="textarea"
              name="caption"
              id="caption"
              rows={4}
              className="form-control"
              placeholder="Write your caption here"
              autoComplete="off"
            />
          </FormGroup>

          {/* Tags field */}
          <FormGroup className="mb-4" controlId="formTags">
            Animal tag
            <Typeahead
              id="animaltags"
              options={animalTags}
              placeholder="Lion, Cat, Pigeon, ..."
              multiple
              allowNew
              onChange={(selected) => {
                const newTags = selected.map((item) => {
                  if (typeof item === "string") {
                    return item;
                  } else if (
                    item &&
                    typeof item === "object" &&
                    "label" in item
                  ) {
                    return item.label;
                  }
                });
                setFieldValue(
                  "tags",
                  newTags.filter((tag) => tag)
                );
              }}
              selected={values.tags}
            />
          </FormGroup>

          {/* Buttons */}
          <div className="d-flex justify-content-between">
            <Button
              variant="outline-secondary"
              type="reset"
              onClick={() => {
                setFieldValue("caption", "");
                setFieldValue("file", null);
                setFieldValue("tags", []);
                setFieldValue("image_type", "");
              }}
            >
              Cancel
            </Button>

            <Button variant="dark" type="submit" disabled={isSubmitting}>
              Post
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PostForm;
