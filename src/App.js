import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./css/auth.css";

import AuthRedirect from "./util/AuthRedirect.js";

import LoginPage from "./pages/LoginPage.js";
import CreateAccountPage from "./pages/CreateAccountPage.js";
import AccountPage from "./pages/AccountPage.js";
import MergePage from "./pages/MergePage.js";
import AddPasswordPage from "./pages/AddPasswordPage.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LoginPage />} />
        <Route path="/createAccount" element={<CreateAccountPage />} />
        <Route path="/merge" element={<MergePage />} />
        <Route path="/account" element={<AuthRedirect><AccountPage /></AuthRedirect>} />
        <Route path="/addPassword" element={<AuthRedirect><AddPasswordPage /></AuthRedirect>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
