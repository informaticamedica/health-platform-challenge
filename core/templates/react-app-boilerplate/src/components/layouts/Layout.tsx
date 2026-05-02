import { AppLayout } from "@ds";
import Header from "./Header";
import React from "react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <AppLayout header={<Header />}>{children}</AppLayout>;
};

export default Layout;
