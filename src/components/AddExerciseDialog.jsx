import { useState } from 'react';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
 
export function AddExerciseDialog({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    kg: 0,
    series: 3,
    repeticiones: 10,
    rir: 2,
    rpe: 7,
    videoUrl: '',
  });
 
  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name.trim()) {
      onAdd(formData);
      setFormData({
        name: '',
        kg: 0,
        series: 3,
        repeticiones: 10,
        rir: 2,
        rpe: 7,
        videoUrl: '',
      });
      setOpen(false);
    }
  };
 
  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };
 
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="h-5 w-5" />
          Agregar Ejercicio
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Agregar Nuevo Ejercicio</DialogTitle>
            <DialogDescription>
              Completa los datos del ejercicio para agregarlo a tu rutina.
            </DialogDescription>
          </DialogHeader>
 
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Nombre del Ejercicio</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ej: Press de Banca"
                required
              />
            </div>
 
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="kg">Peso (Kg)</Label>
                <Input
                  id="kg"
                  type="number"
                  value={formData.kg}
                  onChange={(e) => handleChange('kg', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.5"
                />
              </div>
 
              <div className="grid gap-2">
                <Label htmlFor="series">Series</Label>
                <Input
                  id="series"
                  type="number"
                  value={formData.series}
                  onChange={(e) => handleChange('series', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
            </div>
 
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="repeticiones">Repeticiones</Label>
                <Input
                  id="repeticiones"
                  type="number"
                  value={formData.repeticiones}
                  onChange={(e) => handleChange('repeticiones', parseInt(e.target.value) || 0)}
                  min="0"
                />
              </div>
 
              <div className="grid gap-2">
                <Label htmlFor="rir">RIR</Label>
                <Input
                  id="rir"
                  type="number"
                  value={formData.rir}
                  onChange={(e) => handleChange('rir', parseInt(e.target.value) || 0)}
                  min="0"
                  max="10"
                />
              </div>
 
              <div className="grid gap-2">
                <Label htmlFor="rpe">RPE</Label>
                <Input
                  id="rpe"
                  type="number"
                  value={formData.rpe}
                  onChange={(e) => handleChange('rpe', parseInt(e.target.value) || 0)}
                  min="0"
                  max="10"
                />
              </div>
            </div>
 
            <div className="grid gap-2">
              <Label htmlFor="videoUrl">URL del Video (opcional)</Label>
              <Input
                id="videoUrl"
                value={formData.videoUrl}
                onChange={(e) => handleChange('videoUrl', e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            </div>
          </div>
 
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Agregar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}