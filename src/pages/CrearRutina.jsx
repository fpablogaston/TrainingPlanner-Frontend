import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Dumbbell, Save, ArrowLeft } from 'lucide-react';
import { ExerciseItem } from '../components/ExerciseItem';
import { AddExerciseDialog } from '../components/AddExerciseDialog';
import { VideoDialog } from '../components/VideoDialog';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export function CreateRoutine() {
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState('');
  const [exercises, setExercises] = useState([]);
 
  const [videoDialogOpen, setVideoDialogOpen] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(undefined);
 
  const handleAddExercise = (newExercise) => {
    const exercise = {
      ...newExercise,
      id: Date.now().toString(),
    };
    setExercises([...exercises, exercise]);
  };
 
  const handleUpdateExercise = (updatedExercise) => {
    setExercises(
      exercises.map((ex) => (ex.id === updatedExercise.id ? updatedExercise : ex))
    );
  };
 
  const handleDeleteExercise = (id) => {
    setExercises(exercises.filter((ex) => ex.id !== id));
  };
 
  const handlePlayVideo = (videoUrl) => {
    setSelectedVideoUrl(videoUrl);
    setVideoDialogOpen(true);
  };
 
const handleCreateRoutine = async () => {
    if (!studentName.trim()) {
      alert('Por favor ingresa el nombre del alumno');
      return;
    }
    if (exercises.length === 0) {
      alert('Por favor agrega al menos un ejercicio');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/rutinas`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          nombreAlumno: studentName,
          ejercicios: exercises.map(e => ({
            nombre: e.name,
            series: e.series,
            repeticiones: e.repeticiones
          }))
        })
      });

      if (!response.ok) {
        alert('Error al crear la rutina');
        return;
      }

      alert(`Rutina para "${studentName}" creada con éxito!`);
      navigate('/alumnos');
    } catch {
      alert('Error al conectar con el servidor');
    }
  };
 
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6 relative">
      <div className="max-w-6xl mx-auto">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={() => navigate('/')}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Button>
 
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-indigo-600 p-3 rounded-lg">
              <Dumbbell className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Crear Rutina de Entrenamiento</h1>
              <p className="text-gray-600">Planifica tus ejercicios</p>
            </div>
          </div>
 
          {/* Student Name Input */}
          <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nombre Alumno
            </label>
            <Input
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Ej: Juan Pérez"
              className="text-lg"
            />
          </div>
 
          {/* Add Exercise Button */}
          <div className="flex justify-end">
            <AddExerciseDialog onAdd={handleAddExercise} />
          </div>
        </div>
 
        {/* Exercise List */}
        <div className="space-y-3">
          {exercises.length === 0 ? (
            <div className="bg-white p-12 rounded-lg border border-gray-200 text-center">
              <Dumbbell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay ejercicios en tu rutina
              </h3>
              <p className="text-gray-500 mb-6">
                Comienza agregando tu primer ejercicio
              </p>
              <AddExerciseDialog onAdd={handleAddExercise} />
            </div>
          ) : (
            exercises.map((exercise, index) => (
              <div key={exercise.id} className="flex items-center gap-3">
                <div className="bg-indigo-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <ExerciseItem
                    exercise={exercise}
                    onUpdate={handleUpdateExercise}
                    onDelete={handleDeleteExercise}
                    onPlayVideo={handlePlayVideo}
                  />
                </div>
              </div>
            ))
          )}
        </div>
 
        {/* Create Routine Button */}
        {exercises.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button
              size="lg"
              onClick={handleCreateRoutine}
              className="gap-2 px-12 py-6 text-lg"
            >
              <Save className="h-5 w-5" />
              Crear Rutina
            </Button>
          </div>
        )}
      </div>
 
      {/* Video Dialog */}
      <VideoDialog
        open={videoDialogOpen}
        onOpenChange={setVideoDialogOpen}
        videoUrl={selectedVideoUrl}
      />
    </div>
  );
}
