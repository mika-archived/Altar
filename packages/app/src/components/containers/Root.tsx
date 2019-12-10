import axios from "axios";
import React, { useRef, useState, ChangeEvent } from "react";
import styled from "styled-components";

import { PrimaryButton } from "../atoms/Button";
import Container from "../atoms/Container";
import Editor from "../atoms/Editor";
import Input from "../atoms/Input";
import Wrapper from "../organisms/Wrapper";

type ValueGetter = () => string;

const CodeEditor = styled(Editor)`
  max-width: 100%; /* hack */
  height: 600px;
  margin: 20px 0;
`;

const Root: React.FC = () => {
  const [title, setTitle] = useState<string>("notitle");
  const getter = useRef<ValueGetter>();

  const onEditorMounted = (valueGetter: ValueGetter) => {
    getter.current = valueGetter;
  };

  const onTitleChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onClickBuild = async () => {
    if (!getter.current) return;

    const content = getter.current();
  };

  return (
    <Wrapper>
      <Container>
        <Input value={title} onChange={onTitleChanged} />
        <CodeEditor onEditorMounted={onEditorMounted} />
        <PrimaryButton onClick={onClickBuild}>Save and Run</PrimaryButton>
      </Container>
    </Wrapper>
  );
};

export default Root;
