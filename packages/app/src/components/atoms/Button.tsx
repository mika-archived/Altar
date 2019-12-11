import styled from "styled-components";

const Button = styled.button`
  padding: 12px;
  font-size: 18px;
  border: 1px solid #ccc;
  border-radius: 8px;

  :focus {
    outline: 0;
  }
`;

const PrimaryButton = styled(Button)`
  color: #fff;
  background-color: #007acc;
  border-color: #17b;
`;

export { Button, PrimaryButton };
