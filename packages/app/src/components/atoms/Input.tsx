import styled from "styled-components";

const Input = styled.input`
  font-family: Consolas, Menlo, Monaco, "Courier New", monospace;
  color: white;
  background-color: #252526;
  border: 2px solid #bbb;
  border-radius: 4px;
  outline: 0;

  :focus {
    border-color: #0e639c;
  }
`;

export default Input;
