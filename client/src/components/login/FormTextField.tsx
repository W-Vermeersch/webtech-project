import { ErrorMessage } from "@hookform/error-message"

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
      <div className="mb-3">
          <label htmlFor={id} className="form-label">
              {name}
          </label>
          <input
              id={id}
              type={type}
              className="form-control"
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              required
          />
          <div className="invalid-input"> {error}</div>
      </div>
  );
}
