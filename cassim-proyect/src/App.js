import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./HomePage";
import FormPage from "./FormPage";
import MapPage from "./Mapa";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/formulario" element={<FormPage />} />
        <Route path="/mapa" element={<MapPage />} />
      </Routes>
    </Router>
  );
}

export default App;
