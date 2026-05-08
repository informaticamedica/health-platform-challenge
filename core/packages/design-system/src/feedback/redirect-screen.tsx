import { Background } from "../layout/index.js";
import { LoadingSpinner } from "./loading-spinner.js";

export function RedirectScreen() {
  return (
    <Background>
      <LoadingSpinner />
    </Background>
  );
}
