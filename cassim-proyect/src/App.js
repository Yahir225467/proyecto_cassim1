import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Mapa from "./Mapa";
import Formulario from "./Form";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Ruta para la página principal */}
          <Route path="/" element={<Mapa />} />

          {/* Ruta para el formulario */}
          <Route path="/formulario" element={<Formulario />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
