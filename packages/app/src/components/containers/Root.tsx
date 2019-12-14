import React, { useRef, useState, ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";
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
import { FlexboxContainer, FlexItem } from "../atoms/Flexbox";
import Input from "../atoms/Input";
import Section from "../molecules/Section";
import DependencyList from "../organisms/DependencyList";
import Wrapper from "../organisms/Wrapper";

type Dependencies = { name: string; version: string | null }[];
type ValueGetter = () => string;

const Item = styled(FlexItem)`
  min-width: 0;
`;

const CodeEditor = styled(Editor)`
  width: 100%;
  max-width: calc(100% - 1px); /* monaco-editor expands 1px, why??? */
  height: 500px;
`;

const FixedHeightDependencyList = styled(DependencyList)`
  max-height: 454px;
  overflow-y: auto;
`;

const ModuleInput = styled(Input)`
  width: 100%;
  max-width: calc(100% - 22px);
  padding: 8px 4px;
  margin: 4px 5px;
  font-size: 16px;
`;

const OutputConsole = styled(Console)`
  width: 100%;
  height: auto;
  min-height: 24px;
`;

const TitleInput = styled(Input)`
  width: 100%;
  max-width: calc(100% - 20px);
  padding: 12px 8px;
  font-size: 24px;
`;

const Root: React.FC = () => {
  // states
  const getter = useRef<ValueGetter>();
  const [title, setTitle] = useState<string>("notitle");
  const [dependencies, setDependencies] = useState<string[]>(DataValidatorTemplate.DEPENDENCIES);
  const [value, setValue] = useState("");
  const [error, setError] = useState<string>("");
  const [logs, setLogs] = useState<{ event: string; message: string }[]>([]);
  const [isBuilding, setIsBuilding] = useState<boolean>(false);
  const { width } = useWindowSize();

  // utilities
  const { startExecution, fetchExecution, fetchStatus } = useAltarBuild();
  const history = useHistory();
  const { t } = useTranslation();

  const onSubmitInput = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const input = value.trim();
    if (input === "") return;

    setValue("");
    setDependencies([...dependencies, input]);
  };

  const onChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const onEditorMounted = (valueGetter: ValueGetter) => {
    getter.current = valueGetter;
  };

  const onTitleChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const onDependencyRemoved = (str: string) => {
    setDependencies(dependencies.filter(w => w !== str));
  };

  const onClickBuild = async () => {
    if (!getter.current) return;

    const content = getter.current();
    if (content.trim() === "") {
      setError("The code could not be blank");
      return;
    }

    setIsBuilding(true);

    const params = { dependencies, executor: "5.30.1", files: [{ name: "main.pl", content }], title };
    const { buildId } = await startExecution(params);
    if (buildId === null) {
      setIsBuilding(false);
      setError("Build Error: Unknown");
      return;
    }

    const shouldLogging = (events: string[], execution: string) => {
      return events.includes(execution) && !logs.find(w => w.event === execution);
    };

    const fetch = async () => {
      const status = await fetchStatus(buildId);
      if (status === null) {
        setIsBuilding(false);
        setError("Build Error: Failed to fetch build ID from the server.");
        return;
      }

      if (status.events.length < 28) {
        if (shouldLogging(status.events, "ALTAR_INSTALLATION"))
          setLogs(logs.concat({ event: "ALTAR_INSTALLATION", message: "Installing dependencies..." }));
        if (shouldLogging(status.events, "ALTAR_CONTINUE_TO_EXECUTION"))
          setLogs(
            logs.concat({ event: "ALTAR_CONTINUE_TO_EXECUTION", message: "Installed dependencies successfully." })
          );
        if (shouldLogging(status.events, "ALTAR_EXECUTION"))
          setLogs(logs.concat({ event: "ALTAR_EXECUTION", message: "Starting execution..." }));
        if (shouldLogging(status.events, "ALTAR_CONTINUE_TO_RECORD"))
          setLogs(logs.concat({ event: "ALTAR_CONTINUE_TO_RECORD", message: "Collecting results..." }));
        return setTimeout(fetch, 5000);
      }

      const execution = await fetchExecution(buildId);
      setIsBuilding(false);
      history.push(`/permalink/${execution.id}`);
    };

    setLogs([{ event: "ALTAR_START", message: "Start building..." }]);
    setTimeout(fetch, 5000);
  };

  const basis = width >= 756 ? { editor: "calc(100% - 250px)", deps: "250px" } : { editor: "100%", deps: "100%" };

  return (
    <Wrapper>
      <Container>
        <TitleInput value={title} onChange={onTitleChanged} placeholder="notitle" />
        <FlexboxContainer direction="reverse-horizontal" wrap="wrap">
          <Item basis={basis.editor}>
            <Section title="Code">
              <CodeEditor value={DataValidatorTemplate.CODE} onEditorMounted={onEditorMounted} readOnly={isBuilding} />
            </Section>
          </Item>
          <Item basis={basis.deps}>
            <Section title="Dependencies">
              <FixedHeightDependencyList dependencies={dependencies} editable onDelete={onDependencyRemoved} />
              <form onSubmit={onSubmitInput}>
                <ModuleInput
                  value={value}
                  onChange={onChangeInput}
                  placeholder={t("organisms.dependency_list.placeholder")}
                />
              </form>
            </Section>
          </Item>
        </FlexboxContainer>
        <Section title="Output">
          <OutputConsole>{logs.length > 0 ? logs.map(w => w.message).join("\n") : "No Outputs"}</OutputConsole>
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
