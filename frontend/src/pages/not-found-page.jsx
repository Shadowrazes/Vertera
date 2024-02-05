import "../css/not-found-page.css";

function NotFoundPage() {
  return (
    <>
      <h2>Страница не найдена</h2>
      <p className="notfoundpage__text">
        Неправильно набран адрес, или такая страница больше не существует.
      </p>
      <p className="notfoundpage__text">
        Вернуться на <a href="/">главную</a>
      </p>
    </>
  );
}

export default NotFoundPage;
