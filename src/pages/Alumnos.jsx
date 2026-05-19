import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Users, ArrowLeft, Eye, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const API_URL = import.meta.env.VITE_API_URL;

export function Students() {
  const navigate = useNavigate();
  const [routines, setRoutines] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/rutinas`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        setRoutines(data);
      } catch (error) {
        console.error('Error al cargar rutinas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoutines();
  }, []);

  const handleDelete = async (id) => {
    if (confirm('¿Estás seguro de eliminar esta rutina?')) {
      try {
        const token = localStorage.getItem('token');
        await fetch(`${API_URL}/api/rutinas/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setRoutines(routines.filter((r) => r.id !== id));
      } catch (error) {
        console.error('Error al eliminar rutina:', error);
      }
    }
  };

  if (loading) return <p className="p-6">Cargando...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Button>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-3 rounded-lg">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Alumnos</h1>
                <p className="text-gray-600">Gestiona las rutinas de todos tus alumnos</p>
              </div>
            </div>
            <Button size="lg" onClick={() => navigate('/crear-rutina')} className="gap-2">
              Nueva Rutina
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          {routines.length === 0 ? (
            <div className="bg-white p-12 rounded-lg border border-gray-200 text-center">
              <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay rutinas creadas</h3>
              <p className="text-gray-500 mb-6">Comienza creando tu primera rutina</p>
              <Button onClick={() => navigate('/crear-rutina')}>Crear Primera Rutina</Button>
            </div>
          ) : (
            routines.map((routine) => (
              <Card key={routine.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{routine.nombreAlumno}</h3>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span><span className="font-medium">{routine.ejercicios?.length}</span> ejercicios</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" title="Ver rutina" onClick={() => navigate(`/rutina/${routine.id}`)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDelete(routine.id)} title="Eliminar rutina">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}