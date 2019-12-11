import React from "react";

import Container from "../atoms/Container";
import Section from "../molecules/Section";
import Wrapper from "../organisms/Wrapper";

const Terms: React.FC = () => {
  return (
    <Wrapper>
      <Container>
        <Section title="Terms of Service"></Section>
      </Container>
    </Wrapper>
  );
};

export default Terms;
