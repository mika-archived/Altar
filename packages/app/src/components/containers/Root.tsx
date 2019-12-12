import React, { useRef, useState, ChangeEvent } from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";

import useAltarBuild from "../../hooks/useAltarBuild";
import useWindowSize from "../../hooks/useWindowSize";
import DataValidatorTemplate from "../../templates/data-validator";

import Alert from "../atoms/Alert";
import { PrimaryButton } from "../atoms/Button";
import Console from "../atoms/Console";
import Container from "../atoms/Container";
import Editor from "../atoms/Editor";
import Input from "../atoms/Input";
import Wrapper from "../organisms/Wrapper";
import { FlexboxContainer, FlexItem } from "../atoms/Flexbox";
import Section from "../molecules/Section";

type ValueGetter = () => string;

const Item = styled(FlexItem)`
  min-width: 0;
`;

const CodeEditor = styled(Editor)`
  width: 100%;
  max-width: calc(100% - 1px); /* monaco-editor expands 1px, why??? */
  height: 500px;
`;

const OutputConsole = styled(Console)`
  width: 100%;
  height: auto;
  min-height: 24px;
`;

const Root: React.FC = () => {
  // states
  const getter = useRef<ValueGetter>();
  const [title, setTitle] = useState<string>("notitle");
  const [error, setError] = useState<string>("");
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const { width } = useWindowSize();

  // utilities
  const { startExecution, fetchExecution } = useAltarBuild();
  const history = useHistory();

  const onEditorMounted = (valueGetter: ValueGetter) => {
    getter.current = valueGetter;
  };

  const onTitleChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onClickBuild = async () => {
    if (!getter.current) return;

    const content = getter.current();
    if (content.trim() === "") {
      setError("The code could not be blank");
      return;
    }

    setIsBuilding(true);

    const params = { dependencies: [], executor: "5.30.1", files: [{ name: "main.pl", content }], title };
    const { buildId } = await startExecution(params);
    if (buildId === null) {
      setIsBuilding(false);
      setError("Build Error: Unknown");
      return;
    }

    const fetch = async () => {
      const execution = await fetchExecution(buildId);
      if (execution.status === "") return setTimeout(fetch, 1000);
      setIsBuilding(false);
      history.push(`/permalink/${execution.id}`);
    };

    setTimeout(fetch, 5000);
  };

  const basis = width >= 756 ? { editor: "calc(100% - 250px)", deps: "250px" } : { editor: "100%", deps: "100%" };

  return (
    <Wrapper>
      <Container>
        <Input value={title} onChange={onTitleChanged} placeholder="notitle" />
        <FlexboxContainer direction="reverse-horizontal" wrap="wrap">
          <Item basis={basis.editor}>
            <Section title="Code">
              <CodeEditor value={DataValidatorTemplate.CODE} onEditorMounted={onEditorMounted} />
            </Section>
          </Item>
          <Item basis={basis.deps}>
            <Section title="Dependencies"></Section>
          </Item>
        </FlexboxContainer>
        <Section title="Output">
          <OutputConsole />
        </Section>
        {error !== "" ? (
          <Alert color="error" title="Error">
            {error}
          </Alert>
        ) : (
          <></>
        )}
        <PrimaryButton onClick={onClickBuild} disabled={isBuilding}>
          Save and Run
        </PrimaryButton>
      </Container>
    </Wrapper>
  );
};

export default Root;
