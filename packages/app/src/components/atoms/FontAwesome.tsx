import React from "react";

type Types = "solid" | "regular" | "light" | "duotone" | "brand";

type Props = {
  fixed?: boolean;
  icon: string;
  type: Types;
};

const getPrefix = (type: Types): string => {
  switch (type) {
    case "solid":
      return "fas";

    case "regular":
      return "far";

    case "light":
      return "fal";

    case "duotone":
      return "fad";

    case "brand":
      return "fab";
  }
};

const FontAwesome: React.FC<Props> = ({ fixed, icon, type }) => {
  const classes = [getPrefix(type), `fa-${icon}`];
  if (fixed) classes.push("fa-fw");

  return <i className={classes.join(" ")}></i>;
};

export default FontAwesome;
