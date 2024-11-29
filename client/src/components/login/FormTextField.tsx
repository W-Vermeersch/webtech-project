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
      <FloatingLabel label={label} className="mb-3">
        <Form.Control
          {...field}
          {...props}
          className={meta.touched && meta.error ? "input-error" : ""}
        />
      </FloatingLabel>
      {meta.touched && meta.error && <div className="error">{meta.error}</div>}
    </>
  );
};

export default CustomInput;
