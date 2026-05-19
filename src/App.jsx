import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { Students } from "./pages/Alumnos";
import { CreateRoutine } from "./pages/CrearRutina";
import { Login } from "./pages/Login";
import { Rutina } from "./pages/Rutina";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Home />} />
        <Route path="/alumnos" element={<Students />} />
        <Route path="/crear-rutina" element={<CreateRoutine />} />
        <Route path="/rutina/:id" element={<Rutina />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;