import { LoadingSpinner } from "../common/LoadingSpinner";
import { Background } from "./Background";
import React from "react";

export const Redirect = () => {
  return (
    <Background>
      <LoadingSpinner />
    </Background>
  );
};
