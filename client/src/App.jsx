import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <Routes>
      <Route path="/lowda" element={<LandingPage />} />
    </Routes>
  );
}

export default App;
