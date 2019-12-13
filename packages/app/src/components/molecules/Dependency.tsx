import React, { useState } from "react";
import { Transition } from "react-transition-group";
import { TransitionStatus } from "react-transition-group/Transition";
import styled from "styled-components";

import { LinkButton } from "../atoms/Button";
import { FlexboxContainer, FlexItem } from "../atoms/Flexbox";
import FontAwesome from "../atoms/FontAwesome";
import Hyperlink from "../atoms/Hyperlink";

type Dependency = { name: string; version: string | null };

type Props = {
  dependency: Dependency;
  editable?: boolean;
  onClickDelete?: (str: string) => void;
};

const Container = styled(FlexboxContainer)`
  overflow: hidden;
  font-size: 18px;
`;

const FadeAnimation = styled.div<{ state: TransitionStatus }>`
  display: inline-block;
  width: ${({ state }) => (state === "entering" || state === "exited" ? "0" : "24px")};
  transition: 0.1s;
  transform: ${({ state }) => (state === "entering" || state == "exited" ? "translateX(20px)" : "translateX(0)")};
`;

const Link = styled(Hyperlink)`
  color: white;
`;

const Name = styled.div`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Version = styled.div`
  display: inline-block;
  margin: 0 5px;
  color: #999;
  text-overflow: ellipsis;
`;

const Dependency: React.FC<Props> = ({ dependency, editable, onClickDelete }) => {
  const [hover, setHover] = useState(false);

  const onMouseEnter = () => setHover(true);
  const onMouseLeave = () => setHover(false);
  const OnClickButton = () => {
    if (onClickDelete) onClickDelete(`${dependency.name}@${dependency.version}`);
  };

  return (
    <Container onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <FlexItem basis={"200px"} shrink>
        <Name>
          <Link href={`https://metacpan.org/pod/${dependency.name}`} target="_blank" rel="noreferrer noopener">
            {dependency.name}
          </Link>
        </Name>
      </FlexItem>
      <FlexItem>
        <Version>{dependency.version || "(null)"}</Version>
        <Transition in={editable && hover} timeout={100}>
          {state => (
            <FadeAnimation state={state}>
              <LinkButton onClick={OnClickButton}>
                <FontAwesome icon="trash" type="regular" fixed />
              </LinkButton>
            </FadeAnimation>
          )}
        </Transition>
      </FlexItem>
    </Container>
  );
};

export default Dependency;
