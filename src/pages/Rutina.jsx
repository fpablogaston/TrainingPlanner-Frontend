import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft, Dumbbell, ChevronDown, ChevronUp,
  Play, AlertCircle, Loader2, Plus, Minus,
  Pencil, Check, Trash2,
} from 'lucide-react';
import { rutinas, ejerciciosDia, ejerciciosBase } from '../services/api';

function StatControl({ label, value, onChange }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(0, value - 1))}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <Minus className="h-3 w-3 text-gray-600" />
        </button>
        <span className="w-10 text-center font-bold text-gray-900 text-lg tabular-nums">
          {value}
        </span>
        <button
          onClick={() => onChange(value + 1)}
          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
        >
          <Plus className="h-3 w-3 text-gray-600" />
        </button>
      </div>
    </div>
  );
}

function EjercicioCard({ ejercicio, isOpen, onToggle, modoEdicion, onDelete, onSave }) {
  const [kg, setKg] = useState(ejercicio.kg ?? 0);
  const [series, setSeries] = useState(ejercicio.series ?? 0);
  const [reps, setReps] = useState(ejercicio.repeticiones ?? 0);
  const [nombre, setNombre] = useState(ejercicio.ejercicioBase?.nombre ?? '');
  const [imagenUrl, setImagenUrl] = useState(ejercicio.ejercicioBase?.imagenUrl ?? '');
  const [videoUrl, setVideoUrl] = useState(ejercicio.ejercicioBase?.videoUrl ?? '');
  const [guardando, setGuardando] = useState(false);

  const base = ejercicio.ejercicioBase;

  const handleSave = async () => {
    setGuardando(true);
    try {
      await ejerciciosDia.update(ejercicio.id, { series, repeticiones: reps, kg });
      await ejerciciosBase.update(base.id, {
        nombre,
        imagenUrl: imagenUrl || null,
        videoUrl: videoUrl || null,
        esGlobal: base.esGlobal,
      });
      onSave(ejercicio.id, { nombre, imagenUrl, videoUrl, kg, series, repeticiones: reps });
    } catch {
      alert('Error al guardar. Intentá de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <span className="font-medium text-gray-900">{nombre || base?.nombre}</span>
        <div className="flex items-center gap-2">
          {modoEdicion && (
            <span
              onClick={(e) => { e.stopPropagation(); onDelete(ejercicio.id); }}
              className="p-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4 text-red-400" />
            </span>
          )}
          {isOpen
            ? <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" />
            : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />}
        </div>
      </button>

      {isOpen && (
        <div className="px-4 pb-5 pt-3 bg-white border-t border-gray-100 space-y-4">

          {modoEdicion && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 space-y-3">
              <p className="text-xs font-semibold text-violet-700 uppercase tracking-wide">
                Editar ejercicio
              </p>
              <div className="space-y-1">
                <label className="text-xs text-gray-500">Nombre</label>
                <input
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500 flex items-center gap-1">
                  🖼 URL de imagen
                </label>
                <input
                  value={imagenUrl}
                  onChange={(e) => setImagenUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-500 flex items-center gap-1">
                  🎬 URL de video (YouTube)
                </label>
                <input
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://youtube.com/..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
              </div>
              <button
                onClick={handleSave}
                disabled={guardando}
                className="w-full py-2 bg-violet-700 text-white text-sm font-medium rounded-lg hover:bg-violet-800 transition-colors disabled:opacity-50"
              >
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          )}

          {imagenUrl || base?.imagenUrl ? (
            <img
              src={imagenUrl || base?.imagenUrl}
              alt={nombre || base?.nombre}
              className="w-full rounded-xl object-cover max-h-52"
            />
          ) : null}

          <div className="grid grid-cols-3 divide-x divide-gray-200 border border-gray-200 rounded-xl overflow-hidden">
            <div className="py-3 flex justify-center">
              <StatControl label="KG" value={kg} onChange={setKg} />
            </div>
            <div className="py-3 flex justify-center">
              <StatControl label="Series" value={series} onChange={setSeries} />
            </div>
            <div className="py-3 flex justify-center">
              <StatControl label="Reps" value={reps} onChange={setReps} />
            </div>
          </div>

          {(videoUrl || base?.videoUrl) && (
            <div className="flex justify-center">
              <button
                onClick={() => window.open(videoUrl || base?.videoUrl, '_blank', 'noopener,noreferrer')}
                className="flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Play className="h-4 w-4" />
                Ver Video
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function DiaCard({ dia, isOpen, onToggle, modoEdicion, onDeleteEjercicio, onSaveEjercicio }) {
  const [ejerciciosAbiertos, setEjerciciosAbiertos] = useState(new Set());

  const toggleEjercicio = (ejId) => {
    setEjerciciosAbiertos((prev) => {
      const next = new Set(prev);
      if (next.has(ejId)) next.delete(ejId);
      else next.add(ejId);
      return next;
    });
  };

  const numeroDia = dia.numeroDia ?? dia.numero;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="w-10 h-10 rounded-full bg-violet-700 flex items-center justify-center shrink-0">
          <span className="text-white font-bold text-sm">{numeroDia}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900">
            Día {numeroDia}{dia.descripcion ? ` - ${dia.descripcion}` : ''}
          </p>
          <p className="text-xs text-gray-400">{dia.ejercicios?.length ?? 0} ejercicios</p>
        </div>
        {isOpen
          ? <ChevronUp className="h-5 w-5 text-gray-400 shrink-0" />
          : <ChevronDown className="h-5 w-5 text-gray-400 shrink-0" />}
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 space-y-2 border-t border-gray-100">
          {(dia.ejercicios?.length ?? 0) === 0 && (
            <p className="text-center text-gray-400 text-sm py-4">Sin ejercicios.</p>
          )}
          {dia.ejercicios?.map((ej) => (
            <EjercicioCard
              key={ej.id}
              ejercicio={ej}
              isOpen={ejerciciosAbiertos.has(ej.id)}
              onToggle={() => toggleEjercicio(ej.id)}
              modoEdicion={modoEdicion}
              onDelete={onDeleteEjercicio}
              onSave={onSaveEjercicio}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function Rutina() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [rutina, setRutina] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [diasAbiertos, setDiasAbiertos] = useState(new Set());
  const [modoEdicion, setModoEdicion] = useState(false);

  useEffect(() => {
    rutinas
      .getById(id)
      .then((data) => {
        setRutina(data);
        if (data.dias?.length > 0) {
          setDiasAbiertos(new Set([data.dias[0].id]));
        }
      })
      .catch(() => setError('No se pudo cargar la rutina. Intentá de nuevo.'))
      .finally(() => setLoading(false));
  }, [id]);

  const toggleDia = (diaId) => {
    setDiasAbiertos((prev) => {
      const next = new Set(prev);
      if (next.has(diaId)) next.delete(diaId);
      else next.add(diaId);
      return next;
    });
  };

  const handleDeleteEjercicio = async (ejercicioId) => {
    if (!confirm('¿Eliminar este ejercicio?')) return;
    try {
      await ejerciciosDia.delete(ejercicioId);
      setRutina((prev) => ({
        ...prev,
        dias: prev.dias.map((d) => ({
          ...d,
          ejercicios: d.ejercicios.filter((e) => e.id !== ejercicioId),
        })),
      }));
    } catch {
      alert('Error al eliminar. Intentá de nuevo.');
    }
  };

  const handleSaveEjercicio = (ejercicioId, nuevosValores) => {
    setRutina((prev) => ({
      ...prev,
      dias: prev.dias.map((d) => ({
        ...d,
        ejercicios: d.ejercicios.map((e) =>
          e.id === ejercicioId
            ? {
                ...e,
                kg: nuevosValores.kg,
                series: nuevosValores.series,
                repeticiones: nuevosValores.repeticiones,
                ejercicioBase: {
                  ...e.ejercicioBase,
                  nombre: nuevosValores.nombre,
                  imagenUrl: nuevosValores.imagenUrl,
                  videoUrl: nuevosValores.videoUrl,
                },
              }
            : e
        ),
      })),
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-violet-700" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <button
          onClick={() => navigate('/alumnos')}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a alumnos
        </button>
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!rutina) return null;

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-2xl mx-auto space-y-5">

        <button
          onClick={() => navigate('/alumnos')}
          className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver a alumnos
        </button>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center gap-4">
          <div className="bg-violet-700 p-3 rounded-xl shrink-0">
            <Dumbbell className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">{rutina.nombreAlumno}</h1>
            <p className="text-sm text-gray-400">Rutina de Entrenamiento</p>
          </div>
          <button
            onClick={() => setModoEdicion((prev) => !prev)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${
              modoEdicion
                ? 'bg-violet-700 text-white border-violet-700'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {modoEdicion
              ? <><Check className="h-4 w-4" /> Listo</>
              : <><Pencil className="h-4 w-4" /> Editar rutina</>
            }
          </button>
        </div>

        {modoEdicion && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-700 flex items-center gap-2">
            <Pencil className="h-4 w-4 shrink-0" />
            Modo entrenador activo — podés editar nombre, imagen, video y eliminar ejercicios.
          </div>
        )}

        {(rutina.dias?.length ?? 0) === 0 && (
          <p className="text-center text-gray-400 py-12">Esta rutina no tiene días cargados.</p>
        )}

        {rutina.dias?.map((dia) => (
          <DiaCard
            key={dia.id}
            dia={dia}
            isOpen={diasAbiertos.has(dia.id)}
            onToggle={() => toggleDia(dia.id)}
            modoEdicion={modoEdicion}
            onDeleteEjercicio={handleDeleteEjercicio}
            onSaveEjercicio={handleSaveEjercicio}
          />
        ))}
      </div>
    </div>
  );
}