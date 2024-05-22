import "../css/not-found-page.css";

import get_translation from "../helpers/translation";

function NotFoundPage() {
  return (
    <>
      <h2>{get_translation("INTERFACE_PAGE_NOT_FOUND")}</h2>
      <p className="notfoundpage__text">
        {get_translation("INTERFACE_WRONG_ADDRESS")}
      </p>
      <p className="notfoundpage__text">
        {get_translation("INTERFACE_BACK_TO")}{" "}
        <a href="/">{get_translation("INTERFACE_MAIN")}</a>
      </p>
    </>
  );
}

export default NotFoundPage;
