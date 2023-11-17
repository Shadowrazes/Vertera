import { Button } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import TitleH2 from "./components/title";
import Form from "./components/form";
import Table from "./components/table";
import AllTickets from "./components/alltickets";
import ButtonOne from "./components/button";
import "./App.css";

import CreateTicket from "./components/create-ticket";

function App() {
  return (
    <div className="container">
      <Header />
      <Router>
        <Routes>
          <Route path="/" element={<CreateTicket />} />
          <Route path="/all-tickets" element={<AllTickets />} />
        </Routes>
      </Router>
      {/* <ButtonOne title="Button One" /> */}
    </div>
  );
}

export default App;
