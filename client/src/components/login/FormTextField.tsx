import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

interface Props {
  name: string;
  id: string;
  type: string;
  placeholder: string;
  onChange: (e: any) => void;
  value: string;
  error: string;
}

export default function FormTextField({
  name,
  id,
  type,
  placeholder,
  onChange,
  value,
  error,
}: Props) {
  return (
    <>
      <FloatingLabel label={name} className="mb-3">
        <Form.Control
          type={type}
          placeholder={placeholder}
          id={id}
          value={value}
          onChange={onChange}
          required
        />
      </FloatingLabel>
      <div className="invalid-input"> {error}</div>
    </>
  );
}
