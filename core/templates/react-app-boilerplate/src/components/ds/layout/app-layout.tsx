import { ReactNode } from "react";

type AppLayoutProps = {
  header?: ReactNode;
  children: ReactNode;
};

export function AppLayout({ header, children }: AppLayoutProps) {
  return (
    <div className="min-h-dvh">
      {header}
      <main>{children}</main>
    </div>
  );
}
