import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Students } from "./pages/Alumnos";
import { CreateRoutine } from "./pages/CrearRutina";
import { Login } from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/alumnos" element={<Students />} />
        <Route path="/crear-rutina" element={<CreateRoutine />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;