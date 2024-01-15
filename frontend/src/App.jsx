import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/header";
import AllTickets from "./pages/all-tickets";
import Chat from "./pages/chat";
import CreateTicket from "./pages/create-ticket";
import Curators from "./pages/curators";
import AddCurator from "./pages/add-curator";
import Admin from "./pages/admin";
import Loader from "./pages/loading";

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
          <Route
            path="/dialog/:userId/:itemId"
            Component={Chat}
            element={<Chat />}
          />
          <Route path="/curators" element={<Curators />} />
          <Route path="/add-curator" element={<AddCurator />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
