// frontend/src/pages/index.tsx
import { LoginCard } from "@/components/auth/LoginCard";
import { Background } from "@ds";

const HomePage = () => {
  return (
    <Background>
      <LoginCard />
    </Background>
  );
};

export default HomePage;
