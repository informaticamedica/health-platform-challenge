import { ReactNode } from "react";

type AppLayoutProps = {
  header?: ReactNode;
  children: ReactNode;
};

export function AppLayout({ header, children }: AppLayoutProps) {
  return (
    <div className="min-h-screen">
      {header}
      <main>{children}</main>
    </div>
  );
}
