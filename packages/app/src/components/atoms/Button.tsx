import styled from "styled-components";

const Button = styled.button`
  padding: 12px;
  font-size: 18px;
  border: 0;
  border-radius: 8px;

  :focus {
    outline: 0;
  }
`;

const PrimaryButton = styled(Button)`
  color: #fff;
  background-color: #0e639c;

  :disabled {
    color: #ccc;
    background-color: #004a83;
  }
`;

export { Button, PrimaryButton };
