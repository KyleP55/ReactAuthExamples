import { BrowserRouter, Routes, Route } from "react-router-dom";

import "./css/auth.css";

import LoginPage from "./pages/LoginPage.js";
import CreateAccountPage from "./pages/CreateAccountPage.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LoginPage />} />
        <Route path="/createAccount" element={<CreateAccountPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
