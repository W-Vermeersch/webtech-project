import FloatingLabel from "react-bootstrap/FloatingLabel";
import Form from "react-bootstrap/Form";

interface Props {
  name: string;
  type: string;
  placeholder: string;
  onChange: (e: any) => void;
  value: string;
}

export default function FormTextField({
  name,
  type,
  placeholder,
  onChange,
  value,
}: Props) {
  return (
    <FloatingLabel label={name} className="mb-3">
      <Form.Control
        type={type}
        placeholder={placeholder}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        required
      />
    </FloatingLabel>
  );
}
