import { Dumbbell } from 'lucide-react';

export function MiRutina() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-lg border border-gray-200 w-full max-w-lg text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-600 p-3 rounded-lg">
            <Dumbbell className="h-6 w-6 text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Bienvenido, tu rutina de hoy</h1>
      </div>
    </div>
  );
}
