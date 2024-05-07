import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/header";
import AllTickets from "./pages/all-tickets";
import Chat from "./pages/chat";
import CreateTicket from "./pages/create-ticket";
import Curators from "./pages/curators";
import AddCurator from "./pages/add-curator";
import EditCurator from "./pages/edit-curator";
import Units from "./pages/all-units";
import AddUnit from "./pages/add-unit";
import EditUnit from "./pages/edit-unit";
import Themes from "./pages/themes";
import AddTheme from "./pages/add-theme";
import EditTheme from "./pages/edit-theme";
import SubThemes from "./pages/subthemes";
import AddSubtheme from "./pages/add-subtheme";
import EditSubtheme from "./pages/edit-subtheme";
import Stats from "./pages/stats";
import Admin from "./pages/admin";
import OuterAuth from "./pages/outer-auth";
import Translation from "./pages/translation";
import Countries from "./pages/countries";
import AddCountry from "./pages/add-country";
import EditCountry from "./pages/edit-country";
import Departments from "./pages/departments";
import CuratorCreateTicket from "./pages/curator-create-ticket";
import NotFoundPage from "./pages/not-found-page";

import Test from "./pages/test";

import "./App.css";

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  return (
    <div className="container">
      <Router>
        <Header user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<CreateTicket />} />
          <Route path="/all-tickets" element={<AllTickets />} />
          <Route path="/dialog/:itemId" Component={Chat} element={<Chat />} />
          <Route path="/curators" element={<Curators />} />
          <Route path="/add-curator" element={<AddCurator />} />
          <Route
            path="/edit-curator/:curatorId"
            Component={EditCurator}
            element={<EditCurator />}
          />
          <Route path="/units" element={<Units />} />
          <Route path="/add-unit" element={<AddUnit />} />
          <Route
            path="/edit-unit/:unitId"
            Component={EditUnit}
            element={<EditUnit />}
          />
          <Route path="/themes" element={<Themes />} />
          <Route path="/add-theme" element={<AddTheme />} />
          <Route
            path="/edit-theme/:themeId"
            Component={EditTheme}
            element={<EditTheme />}
          />
          <Route path="/subthemes" element={<SubThemes />} />
          <Route path="/add-subtheme" element={<AddSubtheme />} />
          <Route
            path="/edit-subtheme/:subthemeId"
            Component={EditSubtheme}
            element={<EditSubtheme />}
          />
          <Route path="/stats" element={<Stats />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/external/authorization" element={<OuterAuth />} />
          <Route path="/translation" element={<Translation />} />
          <Route path="/countries" element={<Countries />} />
          <Route path="/add-country" element={<AddCountry />} />
          <Route
            path="/edit-country/:countryId"
            Component={EditCountry}
            element={<EditCountry />}
          />
          <Route path="/departments" element={<Departments />} />
          <Route
            path="/curator-create-ticket"
            element={<CuratorCreateTicket />}
          />
          <Route path="*" element={<NotFoundPage />} />

          <Route path="/test" element={<Test />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
