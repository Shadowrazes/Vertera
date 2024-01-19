import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/header";
import AllTickets from "./pages/all-tickets";
import Chat from "./pages/chat";
import CreateTicket from "./pages/create-ticket";
import Curators from "./pages/curators";
import AddCurator from "./pages/add-curator";
import EditCurator from "./pages/edit-curator";
import Units from "./pages/units";
import AddUnit from "./pages/add-unit";
import EditUnit from "./pages/edit-unit";

import "./App.css";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  return (
    <div className="container">
      <Header user={user} setUser={setUser} />
      <Router>
        <Routes>
          <Route path="/" element={<CreateTicket />} />
          <Route path="/all-tickets" element={<AllTickets />} />
          <Route
            path="/dialog/:userId/:itemId"
            Component={Chat}
            element={<Chat />}
          />
          <Route path="/curators" element={<Curators />} />
          <Route path="/add-curator" element={<AddCurator />} />
          <Route
            path="/edit-curator/:curatorId"
            Component={EditCurator}
            element={<EditCurator />}
          />
          <Route path="/Units" element={<Units />} />
          <Route path="/add-unit" element={<AddUnit />} />
          <Route
            path="/edit-unit/:unitId"
            Component={EditUnit}
            element={<EditUnit />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
