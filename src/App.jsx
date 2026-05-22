import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Home } from "./pages/Home";
import { Students } from "./pages/Alumnos";
import { CreateRoutine } from "./pages/CrearRutina";
import { Login } from "./pages/Login";
import { Rutina } from "./pages/Rutina";
import { Biblioteca } from "./pages/Biblioteca";

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
        <Route path="/alumnos" element={<PrivateRoute><Students /></PrivateRoute>} />
        <Route path="/crear-rutina" element={<PrivateRoute><CreateRoutine /></PrivateRoute>} />
        <Route path="/rutina/:id" element={<PrivateRoute><Rutina /></PrivateRoute>} />
        <Route path="/biblioteca" element={<PrivateRoute><Biblioteca /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
