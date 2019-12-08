import React from "react";

import Hyperlink from "../atoms/Hyperlink";
import RouterLink from "../atoms/RouterLink";

type Props = {
  className?: string;
  children?: any;
  href: string;
};

const Link: React.FC<Props> = ({ className, children, href }) => {
  if (href.startsWith("/")) {
    return (
      <RouterLink to={href} className={className}>
        {children}
      </RouterLink>
    );
  } else {
    return (
      <Hyperlink href={href} className={className} target="_blank" rel="noreferrer noopener">
        {children}
      </Hyperlink>
    );
  }
};

export default Link;
