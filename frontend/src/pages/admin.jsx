import { useState } from "react";

import ButtonCustom from "../components/button";

import get_translation from "../helpers/translation";
get_translation("INTERFACE_");

function Admin() {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));

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
        <h2>{get_translation("INTERFACE_MUST_AUTH")}</h2>
        <ButtonCustom
          title={get_translation("INTERFACE_AUTH_CURATOR")}
          onClick={handleAuthHelperButton}
          className={"button-hover"}
        />
      </div>
    </>
  );
}

export default Admin;
