import React from "react";
import styled from "styled-components";

import { Heading3 } from "../atoms/Label";
import { ListContainer, ListItem } from "../atoms/List";
import Link from "../molecules/Link";

type Props = {
  title: string;
  items: { href: string; label: string }[];
};

const ListLink = styled(Link)`
  color: #b3b3b3;
`;

const ListSection: React.FC<Props> = ({ title, items }) => {
  return (
    <section>
      <Heading3>{title}</Heading3>

      <ListContainer>
        {items.map(w => {
          return (
            <ListItem key={w.href}>
              <ListLink href={w.href}>{w.label}</ListLink>
            </ListItem>
          );
        })}
      </ListContainer>
    </section>
  );
};

export default ListSection;
