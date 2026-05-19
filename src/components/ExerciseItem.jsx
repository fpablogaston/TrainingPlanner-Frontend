import { Play, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
 
export function ExerciseItem({ exercise, onUpdate, onDelete, onPlayVideo }) {
  const handleChange = (field, value) => {
    onUpdate({
      ...exercise,
      [field]: value,
    });
  };
 
  return (
    <div className="flex items-center gap-3 p-4 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
      <div className="flex-1 min-w-0">
        <Input
          value={exercise.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="Nombre del ejercicio"
          className="font-medium"
        />
      </div>
 
      <div className="flex items-center gap-2">
        <div className="flex flex-col items-center">
          <label className="text-xs text-gray-500 mb-1">Kg</label>
          <Input
            type="number"
            value={exercise.kg}
            onChange={(e) => handleChange('kg', parseFloat(e.target.value) || 0)}
            className="w-16 text-center"
            min="0"
            step="0.5"
          />
        </div>
        <div className="flex flex-col items-center">
          <label className="text-xs text-gray-500 mb-1">Series</label>
          <Input
            type="number"
            value={exercise.series}
            onChange={(e) => handleChange('series', parseInt(e.target.value) || 0)}
            className="w-16 text-center"
            min="0"
          />
        </div>
        <div className="flex flex-col items-center">
          <label className="text-xs text-gray-500 mb-1">Reps</label>
          <Input
            type="number"
            value={exercise.repeticiones}
            onChange={(e) => handleChange('repeticiones', parseInt(e.target.value) || 0)}
            className="w-16 text-center"
            min="0"
          />
        </div>
        <div className="flex flex-col items-center">
          <label className="text-xs text-gray-500 mb-1">RIR</label>
          <Input
            type="number"
            value={exercise.rir}
            onChange={(e) => handleChange('rir', parseInt(e.target.value) || 0)}
            className="w-16 text-center"
            min="0"
            max="10"
          />
        </div>
        <div className="flex flex-col items-center">
          <label className="text-xs text-gray-500 mb-1">RPE</label>
          <Input
            type="number"
            value={exercise.rpe}
            onChange={(e) => handleChange('rpe', parseInt(e.target.value) || 0)}
            className="w-16 text-center"
            min="0"
            max="10"
          />
        </div>
      </div>
 
      <div className="flex gap-2">
        <Button
          size="icon"
          variant="outline"
          onClick={() => onPlayVideo(exercise.videoUrl)}
          title="Ver video"
        >
          <Play className="h-4 w-4" />
        </Button>
 
        <Button
          size="icon"
          variant="outline"
          onClick={() => onDelete(exercise.id)}
          title="Eliminar ejercicio"
        >
          <Trash2 className="h-4 w-4 text-red-500" />
        </Button>
      </div>
    </div>
  );
}