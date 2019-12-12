import React from "react";
import styled from "styled-components";

type Color = "primary" | "info" | "warning" | "error";

type Props = {
  title: string;
  color: Color;
  children: any;
};

const getColor = (color: Color): string => {
  switch (color) {
    case "primary":
      return "#007acc";

    case "info":
      return "#9cdcfe";

    case "warning":
      return "#d7ba7d";

    case "error":
      return "#d16969";
  }
};

const getBorder = (color: Color): string => {
  switch (color) {
    case "primary":
      return "#0061B3";

    case "info":
      return "#83C3E5";

    case "warning":
      return "#BEA164";

    case "error":
      return "#B85050";
  }
};

const Title = styled.div`
  padding: 8px 16px;
  background-color: ${props => getColor((props as any).color)};
  border: 1px solid ${props => getBorder((props as any).color)};
  border-radius: 8px 8px 0 0;
`;

const Content = styled.div`
  padding: 8px 16px;
  border: 1px solid ${props => getBorder((props as any).color)};
  border-top: 0;
  border-radius: 0 0 8px 8px;
`;

const Alert: React.FC<Props> = ({ color, title, children }) => {
  return (
    <div>
      <Title color={color}>{title}</Title>
      <Content color={color}>{children}</Content>
    </div>
  );
};

export default Alert;
