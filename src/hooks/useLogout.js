import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { logoutApi } from "../services/api";
import { toast } from "react-toastify";

export function useLogout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    console.log("handleLogout ejecutado");
    try {
      console.log("llamando logoutApi...");
      await logoutApi();
      console.log("logoutApi ok");
    } catch (err) {
      console.error("logoutApi error:", err);
    } finally {
      console.log("finally ejecutado");
      logout();
      toast.info("Sesión cerrada correctamente");
      navigate("/login", { replace: true });
    }
  };

  return { handleLogout };
}