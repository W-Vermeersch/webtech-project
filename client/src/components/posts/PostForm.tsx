import { Formik, Form, Field, FormikHelpers } from "formik";
import FormLabel from "react-bootstrap/FormLabel";
import { useNavigate } from "react-router-dom";
import {FormGroup, Button, FormCheck} from "react-bootstrap";
import { Typeahead } from "react-bootstrap-typeahead";
import "react-bootstrap-typeahead/css/Typeahead.css";
import FileUploader from "./FileUploader";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { ADD_POST } from "../../api/urls";
import useAuthUser from "../../hooks/useAuthUser";
import {useEffect, useState} from "react";
import 'reactjs-popup/dist/index.css';

interface PostFormValues {
  caption: string;
  file: string;
  tags: string[];
  location: Geolocation | null;
  is_public: boolean;
}
interface geolocation {
  lat: number,
  long: number
}

const animalTags: string[] = ["Cat", "Dog", "Lion"];

const PostForm = () => {
  const axios = useAxiosPrivate();
  const navigate = useNavigate();
  const user = useAuthUser();
  const [location, setLocation] = useState<geolocation | null>(null);
  const [useAlert, setAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const initialValues: PostFormValues = {
    caption: "",
    file: "",
    tags: [],
    location: null,
    is_public: true
  };

  function success(position: GeolocationPosition): void {
    const loc: geolocation = {
      lat: position.coords.latitude,
      long: position.coords.longitude
    };
    setLocation(loc);
  }

  function nop(){
    setLocation(null);
  }

  function FlashMessages() {
    return (
        <div className="floating-alerts">
          <div className="alert alert-success text-center floating-alert shadow-sm">{alertMessage}</div>
        </div>
    );
  }

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, nop);
    }
  })

  async function onSubmit(
    values: PostFormValues,
    actions: FormikHelpers<PostFormValues>
  ) {
    setAlert(false)
    const formData = new FormData();
    formData.append("file", values.file); // Attach the file
    formData.append("caption", values.caption);
    formData.append("tags", values.tags.toString());
    formData.append("public", values.is_public.toString());
    if (location?.lat && location?.long) {
      formData.append("latitude", location.lat.toString());
      formData.append("longitude", location.long.toString());
    }
    try {
      setAlert(false)
      const resp = await axios.post(ADD_POST, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (resp.status == 200){
        navigate(`/profile/${user?.username}`);
      } else {
        setAlert(true)
        setAlertMessage(resp.data);
      }
    } catch (error) {
      setAlert(true)
      setAlertMessage(error.response.data);
    } finally {
      actions.setSubmitting(false);
    }
  }

  return (

    <Formik type initialValues={initialValues} onSubmit={onSubmit}>
      {({ setFieldValue, values, isSubmitting }) => (
        <Form className="p-4 shadow rounded bg-light w-75 mx-auto">
          <FormGroup className="mb-4" controlId="reactFile">
            <FormLabel>
              Drag and drop some files here, or click to select files{" "}
            </FormLabel>
            <FileUploader setFieldValue={setFieldValue} />
          </FormGroup>

          {useAlert? <FlashMessages /> : null}

          {/* Caption field */}
          <FormGroup className="mb-4" controlId="formCaption">
            <FormLabel>Caption</FormLabel>
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
            <FormLabel>Animal tag</FormLabel>
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

          {/* Set post to public or private field */}
          {/*<FormGroup className="mb-4" controlId="formVisibility">*/}
          <FormCheck className="mb-4" id="formVisibility">
            <FormCheck.Label className="me-3">Visibility</FormCheck.Label>
              <FormCheck inline>
                <FormCheck.Input
                    type="radio"
                    name="visibility"
                    id="public"
                    defaultChecked={true}
                    onChange={() => {
                      setFieldValue("is_public", true)
                    }}
                />
                <FormCheck.Label htmlFor="public">Public</FormCheck.Label>
              </FormCheck>
              <FormCheck inline>
                <FormCheck.Input
                    type="radio"
                    name="visibility"
                    id="private"
                    defaultChecked={false}
                    onChange={() => {
                      setFieldValue("is_public", false)
                    }}
                />
                <FormCheck.Label htmlFor="private">Private</FormCheck.Label>
              </FormCheck>
          </FormCheck>


          {/* Buttons */}
          <div className="d-flex justify-content-between">
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
