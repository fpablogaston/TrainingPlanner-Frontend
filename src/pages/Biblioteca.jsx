import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, Search, Plus, Play,
  Dumbbell, Loader2, AlertCircle,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { ejerciciosBase } from '../services/api';

function ExerciseCard({ ejercicio, onClick }) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="relative">
        {ejercicio.imagenUrl ? (
          <img
            src={ejercicio.imagenUrl}
            alt={ejercicio.nombre}
            className="w-full h-36 object-cover"
          />
        ) : (
          <div className="w-full h-36 bg-gray-100 flex items-center justify-center">
            <Dumbbell className="h-10 w-10 text-gray-300" />
          </div>
        )}
        <span
          className={`absolute top-2 right-2 text-xs font-medium px-2 py-0.5 rounded-full ${
            ejercicio.esGlobal
              ? 'bg-violet-100 text-violet-700'
              : 'bg-gray-100 text-gray-600'
          }`}
        >
          {ejercicio.esGlobal ? '🌐 Global' : '👤 Propio'}
        </span>
      </div>
      <div className="p-3">
        <p className="font-semibold text-gray-900 truncate">{ejercicio.nombre}</p>
      </div>
    </div>
  );
}

function DetailModal({ ejercicio, onClose }) {
  return (
    <Dialog open={!!ejercicio} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="sm:max-w-md">
        {ejercicio && (
          <>
            <DialogHeader>
              <DialogTitle>{ejercicio.nombre}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {ejercicio.imagenUrl ? (
                <img
                  src={ejercicio.imagenUrl}
                  alt={ejercicio.nombre}
                  className="w-full rounded-xl object-cover max-h-56"
                />
              ) : (
                <div className="w-full h-40 bg-gray-100 rounded-xl flex items-center justify-center">
                  <Dumbbell className="h-12 w-12 text-gray-300" />
                </div>
              )}

              <span
                className={`inline-block text-xs font-medium px-3 py-1 rounded-full ${
                  ejercicio.esGlobal
                    ? 'bg-violet-100 text-violet-700'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {ejercicio.esGlobal ? '🌐 Ejercicio Global' : '👤 Ejercicio Propio'}
              </span>

              {ejercicio.videoUrl && (
                <div className="flex justify-center">
                  <button
                    onClick={() =>
                      window.open(ejercicio.videoUrl, '_blank', 'noopener,noreferrer')
                    }
                    className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Play className="h-4 w-4" />
                    Ver Video
                  </button>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={onClose}>Cerrar</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

const FORM_VACIO = { nombre: '', urlImagen: '', urlVideo: '', esGlobal: false };

function AddModal({ open, onClose, onAdd }) {
  const [form, setForm] = useState(FORM_VACIO);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  const handleClose = () => {
    setForm(FORM_VACIO);
    setError('');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nombre.trim()) {
      setError('El nombre es obligatorio.');
      return;
    }
    setGuardando(true);
    setError('');
    try {
        const nuevo = await ejerciciosBase.create({
          nombre: form.nombre.trim(),
          imagenUrl: form.urlImagen || null,
          videoUrl: form.urlVideo || null,
          esGlobal: form.esGlobal,
        });
      onAdd(nuevo);
      handleClose();
    } catch {
      setError('Error al guardar el ejercicio. Intentá de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Agregar Ejercicio</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="nombre">
              Nombre <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nombre"
              value={form.nombre}
              onChange={(e) => set('nombre', e.target.value)}
              placeholder="Ej: Press de Banca"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="urlImagen">
              URL Imagen{' '}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </Label>
            <Input
              id="urlImagen"
              value={form.urlImagen}
              onChange={(e) => set('urlImagen', e.target.value)}
              placeholder="https://..."
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="urlVideo">
              URL Video{' '}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </Label>
            <Input
              id="urlVideo"
              value={form.urlVideo}
              onChange={(e) => set('urlVideo', e.target.value)}
              placeholder="https://youtube.com/..."
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={form.esGlobal}
              onChange={(e) => set('esGlobal', e.target.checked)}
              className="w-4 h-4 accent-violet-700 rounded"
            />
            <span className="text-sm text-gray-700">Es ejercicio global</span>
          </label>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function Biblioteca() {
  const navigate = useNavigate();
  const [ejercicios, setEjercicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [seleccionado, setSeleccionado] = useState(null);
  const [addOpen, setAddOpen] = useState(false);

  useEffect(() => {
    ejerciciosBase
      .getAll()
      .then(setEjercicios)
      .catch(() => setError('No se pudo cargar la biblioteca. Intentá de nuevo.'))
      .finally(() => setLoading(false));
  }, []);

  const filtrados = useMemo(
    () =>
      ejercicios.filter((e) =>
        e.nombre.toLowerCase().includes(busqueda.toLowerCase())
      ),
    [ejercicios, busqueda]
  );

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-5xl mx-auto space-y-6">

        {/* Back */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </button>

        {/* Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="bg-violet-700 p-3 rounded-xl shrink-0">
              <Search className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Ejercicios</h1>
              <p className="text-sm text-gray-400">Biblioteca de ejercicios disponibles</p>
            </div>
          </div>
          <button
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors shrink-0"
          >
            <Plus className="h-4 w-4" />
            Agregar Ejercicio
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <Input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar ejercicio por nombre..."
            className="pl-9 bg-white"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-violet-700" />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && filtrados.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Dumbbell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="font-medium text-gray-900 mb-1">
              {busqueda ? 'Sin resultados' : 'Sin ejercicios'}
            </p>
            <p className="text-sm text-gray-400">
              {busqueda
                ? `No hay ejercicios que coincidan con "${busqueda}"`
                : 'Agregá el primer ejercicio con el botón de arriba'}
            </p>
          </div>
        )}

        {/* Grid */}
        {!loading && !error && filtrados.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filtrados.map((ej) => (
              <ExerciseCard
                key={ej.id}
                ejercicio={ej}
                onClick={() => setSeleccionado(ej)}
              />
            ))}
          </div>
        )}

      </div>

      <DetailModal ejercicio={seleccionado} onClose={() => setSeleccionado(null)} />

      <AddModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={(nuevo) => setEjercicios((prev) => [...prev, nuevo])}
      />
    </div>
  );
}
