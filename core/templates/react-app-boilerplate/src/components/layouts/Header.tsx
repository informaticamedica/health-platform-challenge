import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="fixed left-0 right-0 top-0 z-20 border-b border-white/40 bg-white/70 px-4 py-3 text-slate-800 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between">
        <div className="text-xl font-semibold tracking-tight">
          <Link to="/">
            <span className="bg-gradient-to-r from-teal-700 via-cyan-700 to-sky-700 bg-clip-text text-transparent">
              Sistema de Gestion de Pacientes
            </span>
          </Link>
        </div>
        <Button onClick={handleLogout} className="bg-slate-900 hover:bg-slate-800">
          Salir
        </Button>
      </div>
    </header>
  );
};

export default Header;
