import { useAuth } from "@/context/auth";
import { AppHeader, Button } from "@ds";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <AppHeader
      brand={
        <div className="text-xl font-semibold tracking-tight">
          <Link to="/">
            <span className="text-primary">
              Sistema de Gestion de Pacientes
            </span>
          </Link>
        </div>
      }
      actions={
        <Button onClick={handleLogout} variant="secondary" className="text-sm font-bold">
          Salir
        </Button>
      }
    />
  );
};

export default Header;
