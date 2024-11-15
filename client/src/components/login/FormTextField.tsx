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
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {name}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
}
