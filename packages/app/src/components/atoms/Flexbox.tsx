import styled from "styled-components";

type JustifyContent = "start" | "center" | "end" | "between" | "around" | "evenly";
type Direction = "vertical" | "horizontal" | "reverse-vertical" | "reverse-horizontal";

type ContainerProps = {
  content?: JustifyContent;
  direction?: Direction;
  wrap?: "wrap" | "nowrap";
};

type ItemProps = {
  basis?: string;
  grow?: boolean;
  shrink?: boolean;
};

// helpers for creating property values from props
const getFlexDirection = (direction: Direction) => {
  switch (direction) {
    case "horizontal":
      return "row";

    case "reverse-horizontal":
      return "row-reverse";

    case "vertical":
      return "column";

    case "reverse-vertical":
      return "column-reverse";
  }
};

const getFlexJustifyContent = (justifyContent: JustifyContent) => {
  switch (justifyContent) {
    case "start":
      return "flex-start";

    case "center":
      return "center";

    case "end":
      return "flex-end";

    case "between":
      return "space-between";

    case "around":
      return "space-around";

    case "evenly":
      return "space-evenly";
  }
};

const FlexboxContainer = styled.div<ContainerProps>`
  display: flex;
  flex-direction: ${props => getFlexDirection(props.direction || "horizontal")};
  flex-wrap: ${props => props.wrap || "nowrap"};
  align-content: stretch;
  align-items: stretch;
  justify-content: ${props => getFlexJustifyContent(props.content || "start")};
`;

const FlexItem = styled.div<ItemProps>`
  flex-basis: ${props => (props.basis ? props.basis : "auto")};
  flex-grow: ${props => (props.grow ? 1 : 0)};
  flex-shrink: ${props => (props.shrink ? 1 : 0)};
`;

export { FlexboxContainer, FlexItem };
