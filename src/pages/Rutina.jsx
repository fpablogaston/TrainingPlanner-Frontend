import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowLeft, Dumbbell } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

const API_URL = import.meta.env.VITE_API_URL;

export function Rutina() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rutina, setRutina] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRutina = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/api/rutinas/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        setRutina(data);
      } catch (error) {
        console.error('Error al cargar rutina:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchRutina();
  }, [id]);

  if (loading) return <p className="p-6">Cargando...</p>;
  if (!rutina) return <p className="p-6">Rutina no encontrada</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/alumnos')} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>

        <div className="bg-white rounded-xl p-6 mb-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{rutina.nombreAlumno}</h1>
          </div>
          <p className="text-gray-500 text-sm">{rutina.ejercicios?.length} ejercicios</p>
        </div>

        <div className="space-y-3">
          {rutina.ejercicios?.map((ejercicio, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center gap-4">
                <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{ejercicio.nombre}</h3>
                  <p className="text-sm text-gray-600">
                    {ejercicio.series} series × {ejercicio.repeticiones} repeticiones
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}