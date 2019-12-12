import React from "react";
import styled from "styled-components";

const Outer = styled.pre`
  max-width: calc(100% - 2px);
  padding: 8px 16px;
  font-size: 16px;
  color: white;
  background-color: #252526;
  border: 1px solid #bbb;
  border-radius: 4px;
`;

const Code = styled.code`
  font-family: Consolas, Menlo, Monaco, "Courier New", monospace;
`;

type Props = {
  children: any;
};

const Console: React.FC<Props> = ({ children }) => {
  return (
    <Outer>
      <Code>{children}</Code>
    </Outer>
  );
};

export default Console;
