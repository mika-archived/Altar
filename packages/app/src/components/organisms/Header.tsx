import React from "react";
import styled from "styled-components";

import Container from "../atoms/Container";
import Brand from "../molecules/Brand";

type Props = {};

const HeaderContainer = styled.header`
  padding: 20px 0;
  background-color: #3c3c3c;
`;

const Header: React.FC<Props> = () => {
  return (
    <HeaderContainer>
      <Container>
        <Brand />
      </Container>
    </HeaderContainer>
  );
};

export default Header;
