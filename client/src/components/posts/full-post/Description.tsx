import "./Description.css";

interface DescriptionProps {
  description: string;
}

export default function Description({ description }: DescriptionProps) {
  return (
    <div
      id="description"
      className="card text-bg-dark mt-3 mb-3 border border-secondary"
    >
      <div className="card-body">
        <p className="card-text">{description}</p>
      </div>
    </div>
  );
}
