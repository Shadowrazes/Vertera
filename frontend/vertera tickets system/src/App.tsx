import { Button } from "react-bootstrap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import TitleH2 from "./components/title";
import Form from "./components/form";
import Table from "./components/table";
import AllTickets from "./pages/all-tickets";
import ButtonOne from "./components/button";
import TicketTitle from "./components/ticket-title";
import Chat from "./components/chat";
import "./App.css";

import CreateTicket from "./pages/create-ticket";
import SpinnerLoader from "./components/spinner";
import Loader from "./pages/loading";

function App() {
  return (
    <div className="container">
      {/* <Header /> */}
      {/* <Router>
        <Routes>
          <Route path="/" element={<CreateTicket />} />
          <Route path="/all-tickets" element={<AllTickets />} />
          <Route
            path="/dialog"
            element={<TicketTitle title="Обращение #123" state="Открыта" />}
          />
        </Routes>
      </Router> */}
      {/* <TicketTitle title="Обращение #123" state="Открыта" />
      <Chat /> */}
      <Loader />
    </div>
  );
}

export default App;
