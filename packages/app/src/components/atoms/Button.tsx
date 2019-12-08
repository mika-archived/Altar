import styled from "styled-components";

const Button = styled.button`
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;

  :focus {
    outline: 0;
  }
`;

const PrimaryButton = styled(Button)`
  color: #fff;
  background-color: #0e639c;
  border-color: #17b;
`;

export { Button, PrimaryButton };
