import { useState } from "react";

import ButtonCustom from "../components/button";

function Admin() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  if (user) {
    document.location.href = "/";
  }

  const handleAuthHelperButton = () => {
    let headerButton = document.querySelector(".header__button");
    if (headerButton) {
      headerButton.click();
    }
  };

  return (
    <>
      <div className="auth">
        <h2>Необходимо авторизироваться</h2>
        <ButtonCustom
          title="Авторизироваться как куратор"
          onClick={handleAuthHelperButton}
          className={"button-hover"}
        />
      </div>
    </>
  );
}

export default Admin;
