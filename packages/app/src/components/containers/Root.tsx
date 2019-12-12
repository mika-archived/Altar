import axios from "axios";
import React, { useRef, useState, ChangeEvent } from "react";
import styled from "styled-components";

import { PrimaryButton } from "../atoms/Button";
import Console from "../atoms/Console";
import Container from "../atoms/Container";
import Editor from "../atoms/Editor";
import Input from "../atoms/Input";
import Wrapper from "../organisms/Wrapper";
import { FlexboxContainer, FlexItem } from "../atoms/Flexbox";
import Section from "../molecules/Section";

type ValueGetter = () => string;

const CodeEditor = styled(Editor)`
  width: 100%;
  max-width: calc(100% - 6px); /* monaco-editor expands 1px, why?? */
  height: 600px;
  margin: 0 5px 0 0;
`;

const OutputConsole = styled(Console)`
  width: 100%;
  max-width: calc(100% - 5px);
  height: 600px;
  margin: 0 0 0 5px;
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
        <Input value={title} onChange={onTitleChanged} placeholder="notitle" />
        <FlexboxContainer>
          <FlexItem basis="50%">
            <Section title="Code">
              <CodeEditor onEditorMounted={onEditorMounted} />
            </Section>
          </FlexItem>
          <FlexItem basis="50%">
            <Section title="Output">
              <OutputConsole />
            </Section>
            <PrimaryButton onClick={onClickBuild}>Save and Run</PrimaryButton>
          </FlexItem>
        </FlexboxContainer>
      </Container>
    </Wrapper>
  );
};

export default Root;
