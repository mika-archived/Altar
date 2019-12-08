import React from "react";
import styled from "styled-components";

import RouterLink from "../atoms/RouterLink";
import { Heading2 } from "../atoms/Label";

const Label = styled(Heading2)`
  margin: 0;
`;

const Link = styled(RouterLink)`
  color: #fff;

  :hover {
    text-decoration: none;
  }
`;

const Brand: React.FC = () => {
  return (
    <Label>
      <Link to="/">
        <b>Altar</b>
      </Link>
    </Label>
  );
};

export default Brand;
