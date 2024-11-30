import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";
import { useField } from "formik";

interface CustomInputProps {
  label: string;
  name: string;
  [key: string]: any;
}

const CustomInput = ({ label, ...props }: CustomInputProps) => {
  const [field, meta] = useField(props);

  return (
    <>
      <FloatingLabel label={label} className="mb-1">
        <Form.Control
          {...field}
          {...props}
          isValid={meta.touched && !meta.error}
          isInvalid={meta.touched && !!meta.error}
        />
        {meta.touched && meta.error && (
          <Form.Control.Feedback type="invalid">
            {meta.error}
          </Form.Control.Feedback>
        )}
      </FloatingLabel>
    </>
  );
};

export default CustomInput;
