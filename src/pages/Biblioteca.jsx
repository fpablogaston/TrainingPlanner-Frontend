import { useNavigate } from 'react-router';
import { BookOpen, ArrowLeft } from 'lucide-react';
import { Button } from '../components/ui/button';

export function Biblioteca() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/')} className="mb-4 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Button>

        <div className="flex items-center gap-3 mb-8">
          <div className="bg-indigo-600 p-3 rounded-lg">
            <BookOpen className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Biblioteca de Ejercicios</h1>
            <p className="text-gray-600">Administrá tu catálogo de ejercicios</p>
          </div>
        </div>

        <div className="bg-white p-12 rounded-lg border border-gray-200 text-center">
          <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Próximamente</h3>
          <p className="text-gray-500">Esta sección está en construcción</p>
        </div>
      </div>
    </div>
  );
}
