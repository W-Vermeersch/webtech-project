import "./Search.css";

import { useState } from "react";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";

interface SearchProps {
  setSearchType: (searchType: string) => void;
  onSearchComplete: (search: string) => void;
  className?: string;
}

export default function Search({
  setSearchType,
  onSearchComplete,
  className = "",
}: SearchProps) {
  const [search, setSearch] = useState("");
  const [localSearchType, setLocalSearchType] = useState("@");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.currentTarget.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSearchComplete(search);
  }

  return (
    <Form className={`form-inline ${className}`} onSubmit={handleSubmit}>
      <InputGroup>
        <InputGroup.Text className="search-type bg-dark text-light">
          <Button
            variant="dark"
            onClick={() => {
              setSearchType(localSearchType === "@" ? "#" : "@");
              setLocalSearchType(localSearchType === "@" ? "#" : "@");
            }}
          >
            {localSearchType}
            </Button>
        </InputGroup.Text>
        <Form.Control
          className="bg-dark text-light"
          type="text"
          placeholder={localSearchType === "@" ? "Username" : "Animal"}
          value={search}
          onChange={handleChange}
        />
      </InputGroup>
    </Form>
  );
}
