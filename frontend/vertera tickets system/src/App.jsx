import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/header";
import AllTickets from "./pages/all-tickets";
import Chat from "./pages/chat";
import CreateTicket from "./pages/create-ticket";
import Admin from "./pages/admin";
import Loader from "./pages/loading";
import TestTable from "./components/testtable";
import { useState } from "react";

import "./App.css";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  return (
    <div className="container">
      <Header user={user} setUser={setUser} />
      <Router>
        <Routes>
          <Route path="/" element={<CreateTicket />} />
          {/* <Route path="/all-tickets" element={<AllTickets />} /> */}
          <Route path="/all-tickets" element={<AllTickets />} />
          <Route path="/dialog/:itemId" Component={Chat} element={<Chat />} />
        </Routes>
      </Router>
      {/* <TestTable /> */}
    </div>
  );
}

export default App;
