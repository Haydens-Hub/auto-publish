import { FunctionComponent, ReactNode } from "react";

export const Header: FunctionComponent<{ children?: ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex flex-col justify-center items-center gap-8">
      <h2 className="text-3xl md:text-4xl font-bold">
        Hayden&apos;s Journal: Submissions
      </h2>
      <div className="flex flex-col gap-8 text-lg mb">{children}</div>
    </div>
  );
};
