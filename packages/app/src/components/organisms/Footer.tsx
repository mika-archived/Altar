import React from "react";
import styled from "styled-components";

import Container from "../atoms/Container";
import { FlexboxContainer, FlexItem } from "../atoms/Flexbox";
import Copyright from "../atoms/Copyright";
import ListSection from "./ListSection";
import { Heading1 } from "../atoms/Label";

const SmallCopyright = styled(Copyright)`
  font-size: 80%;
`;

const FooterContainer = styled.footer`
  padding: 40px 0;
  background-color: #3c3c3c;
`;

type Props = {};

const Footer: React.FC<Props> = () => {
  const items = [
    { href: "/about", label: "About" },
    { href: "https://twitter.com/MikazukiFuyuno", label: "Twitter" }
  ];

  return (
    <FooterContainer>
      <Container>
        <FlexboxContainer>
          <FlexItem grow>
            <Heading1>Altar</Heading1>
            <p>Online Perl Compiler</p>
            <SmallCopyright />
          </FlexItem>
          <FlexItem grow>
            <FlexboxContainer content="end">
              <FlexItem>
                <ListSection title="Altar" items={items} />
              </FlexItem>
              <FlexItem></FlexItem>
            </FlexboxContainer>
          </FlexItem>
        </FlexboxContainer>
      </Container>
    </FooterContainer>
  );
};

export default Footer;
