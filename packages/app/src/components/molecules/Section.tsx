import React from "react";
import styled from "styled-components";
import { Heading2 } from "../atoms/Label";

const Container = styled.section`
  margin-top: 40px;
  margin-bottom: 20px;
`;

type Props = {
  title: string;
  children?: any;
};

const Section: React.FC<Props> = ({ title, children }) => {
  return (
    <Container>
      <Heading2>{title}</Heading2>
      {children}
    </Container>
  );
};

export default Section;
