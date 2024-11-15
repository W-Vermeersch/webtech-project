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
    <div className="form-floating">
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
      <label htmlFor={name}>{name}</label>
    </div>
  );
}
