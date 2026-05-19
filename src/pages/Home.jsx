import { useNavigate } from 'react-router';
import { Users, PlusCircle, Dumbbell } from 'lucide-react';
import { Button } from '../components/ui/button';

export function Home() {
  const navigate = useNavigate();

  return (
    <div 
      className="min-h-screen relative flex items-center justify-center p-6"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1620188467120-5042ed1eb5da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBmaXRuZXNzJTIwdHJhaW5pbmclMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzc1Mzk3OTE0fDA&ixlib=rb-4.1.0&q=80&w=1080)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* Contenido */}
      <div className="relative z-10 max-w-4xl w-full">
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="bg-indigo-600 p-6 rounded-2xl shadow-2xl">
              <Dumbbell className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Gestión de Rutinas de Entrenamiento
          </h1>
          <p className="text-xl text-gray-200">
            Planifica, organiza y gestiona las rutinas de tus alumnos
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Botón Alumnos */}
          <div 
            onClick={() => navigate('/alumnos')}
            className="group bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-105 border-2 border-transparent hover:border-indigo-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-indigo-100 p-6 rounded-full mb-4 group-hover:bg-indigo-600 transition-colors">
                <Users className="h-12 w-12 text-indigo-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Alumnos</h2>
              <p className="text-gray-600 mb-6">
                Ver y gestionar las rutinas de todos tus alumnos
              </p>
              <Button 
                variant="outline" 
                className="group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600"
              >
                Ver Alumnos
              </Button>
            </div>
          </div>

          {/* Botón Planificar Rutina */}
          <div 
            onClick={() => navigate('/crear-rutina')}
            className="group bg-white/95 backdrop-blur-sm p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:scale-105 border-2 border-transparent hover:border-green-500"
          >
            <div className="flex flex-col items-center text-center">
              <div className="bg-green-100 p-6 rounded-full mb-4 group-hover:bg-green-600 transition-colors">
                <PlusCircle className="h-12 w-12 text-green-600 group-hover:text-white transition-colors" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-3">Planifica tu Rutina</h2>
              <p className="text-gray-600 mb-6">
                Crea una nueva rutina de entrenamiento para un alumno
              </p>
              <Button 
                variant="outline"
                className="group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600"
              >
                Crear Rutina
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}