import React, { useState } from "react";
import styled from "styled-components";

import { FlexboxContainer, FlexItem } from "../atoms/Flexbox";
import FontAwesome from "../atoms/FontAwesome";
import Hyperlink from "../atoms/Hyperlink";

type Props = {
  dependency: { name: string; version: string | null };
};

const Container = styled(FlexboxContainer)`
  font-size: 18px;
`;

const Link = styled(Hyperlink)`
  color: white;
`;

const Version = styled.span`
  color: #ccc;
`;

const Dependency: React.FC<Props> = ({ dependency }) => {
  const [isHover, setIsHover] = useState(false);

  const onMouseEnter = () => setIsHover(true);
  const onMouseLeave = () => setIsHover(false);

  return (
    <Container onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
      <FlexItem grow>
        <Link href={`https://metacpan.org/pod/${dependency.name}`} target="_blank" rel="noreferrer noopener">
          {dependency.name}
        </Link>
      </FlexItem>
      <Version>{dependency.version || "(null)"}</Version>
      {isHover ? <FontAwesome icon="trash" type="regular" fixed /> : <></>}
    </Container>
  );
};

export default Dependency;
