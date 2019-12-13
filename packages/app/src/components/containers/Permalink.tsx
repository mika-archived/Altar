import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";

import useAltarBuild from "../../hooks/useAltarBuild";
import useWindowSize from "../../hooks/useWindowSize";

import Console from "../atoms/Console";
import Container from "../atoms/Container";
import Editor from "../atoms/Editor";
import { Heading1 } from "../atoms/Label";
import { FlexboxContainer, FlexItem } from "../atoms/Flexbox";
import Section from "../molecules/Section";
import DependencyList from "../organisms/DependencyList";
import Wrapper from "../organisms/Wrapper";
import Loading from "./Loading";

type Task = {
  id: string;
  dependencies: { name: string; version: string }[];
  executor: string;
  files: { name: string; content: string }[];
  out: string;
  status: string;
  title: string;
};

const Item = styled(FlexItem)`
  min-width: 0;
`;

const CodeEditor = styled(Editor)`
  width: 100%;
  max-width: calc(100% - 1px); /* monaco-editor expands 1px, why??? */
  height: 500px;
`;

const FixedHeightDependencyList = styled(DependencyList)`
  max-height: 500px;
  overflow-y: auto;
`;

const Line = styled.span`
  display: block;
`;

const OutputConsole = styled(Console)`
  width: 100%;
  height: auto;
  min-height: 24px;
`;

const Permalink: React.FC = () => {
  // states
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { width } = useWindowSize();
  const { id } = useParams();

  // utilities
  const { fetchTask } = useAltarBuild();

  useEffect(() => {
    const func = async () => {
      if (id === undefined) return;

      const task = await fetchTask(id);
      if (task === null) return;
      setTask(task);
      setIsLoading(false);
    };

    func();
    return () => {};
  }, []);

  const basis = width >= 756 ? { editor: "calc(100% - 250px)", deps: "250px" } : { editor: "100%", deps: "100%" };

  return (
    <Wrapper>
      <Container>
        {isLoading ? (
          <Loading />
        ) : (
          <>
            <Heading1>{task!.title}</Heading1>
            <FlexboxContainer direction="reverse-horizontal" wrap="wrap">
              <Item basis={basis.editor}>
                <Section title="Code">
                  <CodeEditor value={task!.files[0].content} readOnly />
                </Section>
              </Item>
              <Item basis={basis.deps}>
                <Section title="Dependencies">
                  <FixedHeightDependencyList dependencies={task!.dependencies} />
                </Section>
              </Item>
            </FlexboxContainer>
            <Section title="Output">
              <OutputConsole>
                {task!.out.split("\n").map((w, i) => (
                  <Line key={w + i}>{w}</Line>
                ))}
              </OutputConsole>
            </Section>
          </>
        )}
      </Container>
    </Wrapper>
  );
};

export default Permalink;
