import "./Search.css";

import { useState } from "react";

import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import NavDropdown from "react-bootstrap/NavDropdown";
import Button from "react-bootstrap/Button";
import { Typeahead } from "react-bootstrap-typeahead";

interface SearchProps {
  setSearchType: (searchType: string) => void;
  onSearchComplete: (search: string) => void;
  symbol: string;
  className?: string;
  
}

export default function Search({
  setSearchType,
  onSearchComplete,
  symbol,
  className = "",
}: SearchProps) {
  const [search, setSearch] = useState("");
  

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.currentTarget.value);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    onSearchComplete(search);
  }

  return (
    <Form className={`form-inline ${className}`} onChange={handleSubmit}>
      <InputGroup>
        <InputGroup.Text className="search-type bg-dark text-light">
          <Button
            variant="dark"
            onClick={() => {
              setSearchType(symbol === "@" ? "#" : "@");
            }}
          >
            {symbol}
            </Button>
        </InputGroup.Text>
          <Form.Control
          className="bg-dark text-light"
          type="text"
          placeholder={symbol === "@" ? "Username" : "Animal"}
          value={search}
          onChange={handleChange}
        />    
      </InputGroup>
    </Form>
  );
}
