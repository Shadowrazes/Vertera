import { useNavigate } from "react-router-dom";

import ButtonCustom from "../components/button";

function OuterAuth() {
  const navigate = useNavigate();

  const goToCreateTicket = () => {
    navigate("/");
  };

  return (
    <>
      <h2 style={{ marginBottom: "20px" }}>Ошибка авторизации</h2>
      <ButtonCustom title="Ок" onClick={goToCreateTicket} />
    </>
  );
}

export default OuterAuth;
