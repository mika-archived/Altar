import React, { useRef } from "react";
import styled from "styled-components";

import { PrimaryButton } from "../atoms/Button";
import Container from "../atoms/Container";
import Editor from "../atoms/Editor";
import Wrapper from "../organisms/Wrapper";

type ValueGetter = () => string;

const CodeEditor = styled(Editor)`
  max-width: 100%; /* hack */
  height: 500px;
`;

const Root: React.FC = () => {
  const getter = useRef<ValueGetter>();

  const onEditorMounted = (valueGetter: ValueGetter) => {
    getter.current = valueGetter;
  };

  const onClickBuild = () => {
    if (getter.current) {
      alert(getter.current());
    }
  };

  return (
    <Wrapper>
      <CodeEditor onEditorMounted={onEditorMounted} />
      <Container>
        <PrimaryButton onClick={onClickBuild}>Save and Run</PrimaryButton>
      </Container>
    </Wrapper>
  );
};

export default Root;
