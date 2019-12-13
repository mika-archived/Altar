import React from "react";
import styled from "styled-components";

import Dependency from "../molecules/Dependency";

type Props = {
  dependencies: { name: string; version: string | null }[];
  readOnly?: boolean;
};

const Container = styled.div`
  margin: 0 5px;
`;

const DependencyList: React.FC<Props> = ({ dependencies }) => {
  return (
    <Container>
      {dependencies.map(dep => {
        return <Dependency dependency={dep} key={dep.name} />;
      })}
    </Container>
  );
};

export default DependencyList;
