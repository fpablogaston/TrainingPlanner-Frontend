import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import {
  ArrowLeft, UserPlus, Trash2, Users,
  Loader2, AlertCircle,
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
import { usuarios, rutinas } from '../services/api';

const FORM_VACIO = { nombreUsuario: '', password: '', rutinaId: '' };

function NuevoAlumnoModal({ open, onClose, rutinasDisponibles, onCreado }) {
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
    if (!form.nombreUsuario.trim() || !form.password.trim()) {
      setError('Usuario y contraseña son obligatorios.');
      return;
    }
    setGuardando(true);
    setError('');
    try {
      const nuevo = await usuarios.create({
        nombreUsuario: form.nombreUsuario.trim(),
        password: form.password,
        rol: 'Alumno',
      });
      if (form.rutinaId) {
        const actualizado = await usuarios.asignarRutina(nuevo.id, parseInt(form.rutinaId));
        onCreado(actualizado ?? { ...nuevo, rutinaId: parseInt(form.rutinaId) });
      } else {
        onCreado(nuevo);
      }
      handleClose();
    } catch {
      setError('Error al crear el alumno. Intentá de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => { if (!open) handleClose(); }}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Nuevo Alumno</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="nombreUsuario">
              Usuario <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nombreUsuario"
              value={form.nombreUsuario}
              onChange={(e) => set('nombreUsuario', e.target.value)}
              placeholder="Ej: juan123"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="password">
              Contraseña <span className="text-red-500">*</span>
            </Label>
            <Input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="rutina">
              Rutina{' '}
              <span className="text-gray-400 font-normal">(opcional)</span>
            </Label>
            <select
              id="rutina"
              value={form.rutinaId}
              onChange={(e) => set('rutinaId', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
            >
              <option value="">Sin rutina asignada</option>
              {rutinasDisponibles.map((r) => (
                <option key={r.id} value={r.id}>{r.nombreAlumno}</option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={guardando}>
              {guardando ? 'Creando...' : 'Crear Alumno'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function Usuarios() {
  const navigate = useNavigate();
  const [lista, setLista] = useState([]);
  const [rutinasDisponibles, setRutinasDisponibles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [eliminando, setEliminando] = useState(null);

  useEffect(() => {
    Promise.all([usuarios.getAll(), rutinas.getAll()])
      .then(([usuariosData, rutinasData]) => {
        setLista(usuariosData);
        setRutinasDisponibles(rutinasData);
      })
      .catch(() => setError('No se pudieron cargar los usuarios. Intentá de nuevo.'))
      .finally(() => setLoading(false));
  }, []);

  const handleEliminar = async (id) => {
    setEliminando(id);
    try {
      await usuarios.delete(id);
      setLista((prev) => prev.filter((u) => u.id !== id));
    } catch {
      setError('Error al eliminar el alumno. Intentá de nuevo.');
    } finally {
      setEliminando(null);
    }
  };

  const getNombreRutina = (usuario) => {
    if (usuario.rutina?.nombre) return usuario.rutina.nombre;
    if (usuario.rutinaId) {
      const r = rutinasDisponibles.find((r) => r.id === usuario.rutinaId);
      return r?.nombre ?? '—';
    }
    return '—';
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </button>

        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-4">
            <div className="bg-violet-700 p-3 rounded-xl shrink-0">
              <Users className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Usuarios</h1>
              <p className="text-sm text-gray-400">Gestión de alumnos registrados</p>
            </div>
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-xl hover:bg-gray-800 transition-colors shrink-0"
          >
            <UserPlus className="h-4 w-4" />
            + Nuevo Alumno
          </button>
        </div>

        {loading && (
          <div className="flex justify-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-violet-700" />
          </div>
        )}

        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {!loading && !error && lista.length === 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="font-medium text-gray-900 mb-1">Sin alumnos</p>
            <p className="text-sm text-gray-400">Creá el primer alumno con el botón de arriba</p>
          </div>
        )}

        {!loading && !error && lista.length > 0 && (
          <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100 overflow-hidden">
            {lista.map((usuario) => (
              <div key={usuario.id} className="flex items-center justify-between px-5 py-4 gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="bg-violet-100 p-2 rounded-full shrink-0">
                    <Users className="h-4 w-4 text-violet-700" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{usuario.nombreUsuario}</p>
                    <p className="text-sm text-gray-400 truncate">
                      Rutina: {getNombreRutina(usuario)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleEliminar(usuario.id)}
                  disabled={eliminando === usuario.id}
                  className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shrink-0 disabled:opacity-50"
                >
                  {eliminando === usuario.id
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Trash2 className="h-4 w-4" />
                  }
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      <NuevoAlumnoModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        rutinasDisponibles={rutinasDisponibles}
        onCreado={(nuevo) => setLista((prev) => [...prev, nuevo])}
      />
    </div>
  );
}
