import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Alumnos from "./pages/Alumnos";
import CrearRutina from "./pages/CrearRutina.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/alumnos" element={<Alumnos />} />
        <Route path="/crear" element={<CrearRutina />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;