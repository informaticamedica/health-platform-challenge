import { Background } from "../layout";
import { LoadingSpinner } from "./loading-spinner";

export function RedirectScreen() {
  return (
    <Background>
      <LoadingSpinner />
    </Background>
  );
}
