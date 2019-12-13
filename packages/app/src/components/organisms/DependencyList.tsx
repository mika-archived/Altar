import React, { useState, ChangeEvent, FormEvent } from "react";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import Dependency from "../molecules/Dependency";

type Props = {
  className?: string;
  dependencies: { name: string; version: string | null }[];
  editable?: boolean;
  onDelete?: (str: string) => void;
  onSubmit?: (str: string) => void;
};

const Container = styled.div`
  margin: 0 5px;
`;

const DependencyList: React.FC<Props> = ({ className, dependencies, editable, onDelete, onSubmit }) => {
  const onClickDelete = (dependency: string) => {
    if (onDelete) onDelete(dependency);
  };

  return (
    <Container className={className}>
      {dependencies.length === 0 && !editable ? <p>No Dependencies</p> : <></>}
      {dependencies.map(dep => {
        return <Dependency dependency={dep} editable={editable} onClickDelete={onClickDelete} key={dep.name} />;
      })}
    </Container>
  );
};

export default DependencyList;
