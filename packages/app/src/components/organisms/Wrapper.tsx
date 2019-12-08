import React from "react";
import styled from "styled-components";

import { FlexboxContainer, FlexItem } from "../atoms/Flexbox";
import Footer from "../organisms/Footer";
import Header from "../organisms/Header";

const Container = styled(FlexboxContainer)`
  height: 100%;
`;

type Props = {
  children?: any;
};

const Wrapper: React.FC<Props> = ({ children }) => {
  return (
    <Container direction="vertical">
      <Header />
      <FlexItem grow>{children}</FlexItem>
      <Footer />
    </Container>
  );
};

export default Wrapper;
