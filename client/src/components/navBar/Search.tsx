import "./Search.css";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import NavDropdown from "react-bootstrap/NavDropdown";

interface SearchProps {
  onSearchComplete?: () => void;
}

export default function Search({ onSearchComplete }: SearchProps) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchType, setSearchType] = useState("@");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.currentTarget.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    onSearchComplete && onSearchComplete();
    e.preventDefault();
    searchType === "@" ? navigate(`/profile/${search}`) : navigate("/home"); // change when we have tags to search for animal posts
    setSearch("");
  }

  return (
    <Form className="form-inline" onSubmit={handleSubmit}>
      <InputGroup>
        <InputGroup.Text className="p-lg-0 bg-dark text-light">
          <NavDropdown title={searchType} className="m-0">
            <NavDropdown.Item
              className="bg-dark text-light"
              onClick={() => setSearchType(searchType === "@" ? "#" : "@")}
            >
              {searchType === "@" ? "#" : "@"}
            </NavDropdown.Item>
          </NavDropdown>
        </InputGroup.Text>
        <Form.Control
          className="bg-dark text-light"
          type="text"
          placeholder={searchType === "@" ? "Username" : "Animal"}
          value={search}
          onChange={handleChange}
        />
      </InputGroup>
    </Form>
  );
}
