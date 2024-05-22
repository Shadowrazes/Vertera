import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { LOGIN_OUTER } from "../apollo/queries";

import Loader from "../pages/loading";
import ButtonCustom from "../components/button";

import get_translation from "../helpers/translation";

function OuterAuth() {
  const [user] = useState(JSON.parse(localStorage.getItem("user")));

  const navigate = useNavigate();

  const goToCreateTicket = () => {
    navigate("/");
  };

  const urlString = window.location.href;

  const url = new URL(urlString);
  const sessionKey = url.searchParams.get("session_key");

  const {
    loading: loadingOuter,
    error: errorOuter,
    data: dataOuter,
  } = useQuery(LOGIN_OUTER, {
    variables: { sessionKey },
  });

  useEffect(() => {
    if (dataOuter && dataOuter.loginOuter) {
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: dataOuter.loginOuter.user.id,
          name: dataOuter.loginOuter.user.name,
          surname: dataOuter.loginOuter.user.surname,
          role: dataOuter.loginOuter.user.role,
          token: dataOuter.loginOuter.token,
        })
      );
      document.location.href = "/";
    }

    if (user) {
      document.location.href = "/";
    }
  }, [dataOuter]);

  if (loadingOuter) {
    return <Loader />;
  }

  if (errorOuter) {
    const networkError = errorOuter.networkError;

    if (networkError) {
      // console.log("Network Error:", networkError);

      if (networkError.result && networkError.result.errors) {
        const errorMessage = networkError.result.errors[0].message;

        console.log("Error Message from Response:", errorMessage);
        if (user && errorMessage === "Invalid token") {
          localStorage.removeItem("user");
          document.location.href = "/";
        } else if (errorMessage === "Forbidden") {
          return <NotFoundPage />;
        }
      }
    }

    return (
      <>
        <h2 style={{ marginBottom: "20px" }}>
          {get_translation("INTERFACE_ERROR_OUTERAUTH")}
        </h2>
        <ButtonCustom
          title="Ок"
          className={"button-hover"}
          onClick={goToCreateTicket}
        />
      </>
    );
  }

  return <></>;
}

export default OuterAuth;
