import { Formik, Form, Field, FormikHelpers} from "formik";
import { FormGroup, Button } from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import 'react-bootstrap-typeahead/css/Typeahead.css';
import FileUploader from "./FileUploader";
import axios from "axios";
import RouteToServer from "../../infos";

interface PostFormValues {
  caption: string;
  file: string;
  tags: string[];
  image_type: string;
} 

const animalTags: string[] = ["Cat", "Dog", "Lion"];


const PostForm = () => {

  const initialValues: PostFormValues = {
    caption: "",
    file: "",
    tags: [],
    image_type: "",
  };
  

  async function onSubmit(values: PostFormValues, actions: FormikHelpers<PostFormValues>){
    console.log("Form data:", values);
    try {
    const resp = await axios.post(RouteToServer("/post/add"), values);
      console.log("Response:", resp.data);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      actions.setSubmitting(false);
    }
  }  

  return (
    <Formik
        type
      initialValues={initialValues}
      onSubmit={onSubmit}
    >
      {({ setFieldValue, values, isSubmitting }) => (
        
        
        <Form className="p-4 shadow rounded bg-light w-75 mx-auto">

        <FormGroup className="mb-4 " controlId="reactFile">
            <FileUploader setFieldValue={setFieldValue}/>
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
                  } else if (item && typeof item === "object" && "label" in item) {
                    return item.label;
                  }});
                setFieldValue("tags", newTags.filter(tag => tag));
              }}
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
                setFieldValue("image_type", "");
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
