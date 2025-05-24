import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth } from "../../services/firebase";

export default function LogOut() {
  const navigate = useNavigate()

  const handleLogOut = async () => {
    try {
      await auth.signout();
      navigate("/")
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      alert("Erro ao fazer logout. Tente novamente.");
    }
  }

  return (
    <Box>
      {/* // TODO: Fazer um avatar que ao clicar abre um menu item e tem a opção de logout*/}
    </Box>
  )
}