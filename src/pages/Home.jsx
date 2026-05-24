import { useNavigate } from 'react-router';
import { Users, PlusCircle, BookOpen, Dumbbell, LogIn, LogOut } from 'lucide-react';

export function Home() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const nombre = localStorage.getItem('nombre') ?? localStorage.getItem('usuario') ?? '';
  const esEntrenador = localStorage.getItem('rol') === 'Entrenador';

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center p-6"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1620188467120-5042ed1eb5da?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxneW0lMjBmaXRuZXNzJTIwdHJhaW5pbmclMjBlcXVpcG1lbnR8ZW58MXx8fHwxNzc1Mzk3OTE0fDA&ixlib=rb-4.1.0&q=80&w=1080)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/55" />

      {/* Session button — top right */}
      <div className="absolute top-5 right-6 z-10 flex items-center gap-3">
        {token ? (
          <>
            {nombre && (
              <span className="text-white/80 text-sm font-medium hidden sm:block">{nombre}</span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 backdrop-blur text-white text-sm font-medium rounded-lg border border-white/25 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Cerrar sesión
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="flex items-center gap-2 px-4 py-2 bg-white/15 hover:bg-white/25 backdrop-blur text-white text-sm font-medium rounded-lg border border-white/25 transition-colors"
          >
            <LogIn className="h-4 w-4" />
            Iniciar sesión
          </button>
        )}
      </div>

      <div className="relative z-10 max-w-5xl w-full">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex justify-center mb-6">
            <div className="bg-violet-600 p-5 rounded-2xl shadow-2xl">
              <Dumbbell className="h-14 w-14 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-4">
            Gestión de Rutinas de Entrenamiento
          </h1>
          <p className="text-lg text-gray-200">
            Planifica, organiza y gestiona las rutinas de tus alumnos
          </p>
        </div>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-3">

          {/* Alumnos */}
          <div
            onClick={() => navigate('/alumnos')}
            className="group bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-xl flex flex-col items-center text-center cursor-pointer border-2 border-transparent hover:border-indigo-500 transition-all duration-200"
          >
            <div className="bg-indigo-100 p-6 rounded-full mb-6 group-hover:bg-indigo-600 transition-colors duration-200">
              <Users className="h-12 w-12 text-indigo-600 group-hover:text-white transition-colors duration-200" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Alumnos</h2>
            <p className="text-gray-500 text-base mb-8">
              Ver y gestionar las rutinas de todos tus alumnos
            </p>
            <button className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-all duration-200">
              Ver Alumnos
            </button>
          </div>

          {/* Planifica tu Rutina */}
          <div
            onClick={() => navigate('/crear-rutina')}
            className="group bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-xl flex flex-col items-center text-center cursor-pointer border-2 border-transparent hover:border-green-500 transition-all duration-200"
          >
            <div className="bg-green-100 p-6 rounded-full mb-6 group-hover:bg-green-600 transition-colors duration-200">
              <PlusCircle className="h-12 w-12 text-green-600 group-hover:text-white transition-colors duration-200" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Planifica tu Rutina</h2>
            <p className="text-gray-500 text-base mb-8">
              Crea una nueva rutina de entrenamiento para un alumno
            </p>
            <button className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 group-hover:bg-green-600 group-hover:text-white group-hover:border-green-600 transition-all duration-200">
              Crear Rutina
            </button>
          </div>

          {/* Ejercicios */}
          <div
            onClick={() => navigate('/biblioteca')}
            className="group bg-white/95 backdrop-blur-sm p-10 rounded-2xl shadow-xl flex flex-col items-center text-center cursor-pointer border-2 border-transparent hover:border-purple-500 transition-all duration-200"
          >
            <div className="bg-purple-100 p-6 rounded-full mb-6 group-hover:bg-purple-600 transition-colors duration-200">
              <BookOpen className="h-12 w-12 text-purple-600 group-hover:text-white transition-colors duration-200" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Ejercicios</h2>
            <p className="text-gray-500 text-base mb-8">
              Explora y gestiona tu biblioteca de ejercicios
            </p>
            <button className="px-6 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 group-hover:bg-purple-600 group-hover:text-white group-hover:border-purple-600 transition-all duration-200">
              Ver Ejercicios
            </button>
          </div>

        </div>

        {/* Footer link — Gestionar usuarios (solo Entrenador) */}
        {esEntrenador && (
          <p className="text-center mt-10">
            <button
              onClick={() => navigate('/usuarios')}
              className="text-white/50 hover:text-white/80 text-sm underline underline-offset-2 transition-colors"
            >
              Gestionar usuarios
            </button>
          </p>
        )}

      </div>
    </div>
  );
}
