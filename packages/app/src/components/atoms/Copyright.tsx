import React from "react";

type Props = {
  className?: string;
};

const Copyright: React.FC<Props> = ({ className }) => {
  const thisYear = new Date().getFullYear();

  return (
    <p className={className}>
      &copy;
      {thisYear === 2019 ? ` ${thisYear} ` : ` 2019-${thisYear} `}
      Fuyuno Mikazuki
    </p>
  );
};

export default Copyright;
