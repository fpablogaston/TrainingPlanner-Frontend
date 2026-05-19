import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dumbbell } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;

export function Login() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!usuario || !password) {
      setError('Completá todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password })
      });

      if (!response.ok) {
        setError('Usuario o contraseña incorrectos');
        return;
      }

      const data = await response.json();
      localStorage.setItem('token', data.token);
      navigate('/');
    } catch {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg border border-gray-200 w-full max-w-md">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-600 p-3 rounded-lg">
            <Dumbbell className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Training Planner</h1>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
            <Input value={usuario} onChange={(e) => setUsuario(e.target.value)} placeholder="admin" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button onClick={handleLogin} disabled={loading} className="w-full">
            {loading ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </div>
      </div>
    </div>
  );
}