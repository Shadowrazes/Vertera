import "../css/title.css";

function TitleH2({ title, className }: { title: string; className: string }) {
  return <h2 className={className}>{title}</h2>;
}

export default TitleH2;
