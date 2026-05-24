import { useState, useEffect } from 'react';
import { Dumbbell, ChevronDown, ChevronUp, Play, AlertCircle, Loader2 } from 'lucide-react';
import { usuarios } from '../services/api';

function StatDisplay({ label, value }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</span>
      <span className="font-bold text-gray-900 text-lg tabular-nums">{value}</span>
    </div>
  );
}

function EjercicioCard({ ejercicio, isOpen, onToggle }) {
  const base = ejercicio.ejercicioBase;
  const nombre = base?.nombre ?? '';
  const imagenUrl = base?.imagenUrl ?? '';
  const videoUrl = base?.videoUrl ?? '';

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-gray-50 transition-colors text-left"
      >
        <span className="font-medium text-gray-900">{nombre}</span>
        {isOpen
          ? <ChevronUp className="h-4 w-4 text-gray-400 shrink-0" />
          : <ChevronDown className="h-4 w-4 text-gray-400 shrink-0" />}
      </button>

      {isOpen && (
        <div className="px-4 pb-5 pt-3 bg-white border-t border-gray-100 space-y-4">
          {imagenUrl && (
            <img
              src={imagenUrl}
              alt={nombre}
              className="w-full rounded-xl object-cover max-h-52"
            />
          )}

          <div className="grid grid-cols-3 divide-x divide-gray-200 border border-gray-200 rounded-xl overflow-hidden">
            <div className="py-3 flex justify-center">
              <StatDisplay label="KG" value={ejercicio.kg ?? 0} />
            </div>
            <div className="py-3 flex justify-center">
              <StatDisplay label="Series" value={ejercicio.series ?? 0} />
            </div>
            <div className="py-3 flex justify-center">
              <StatDisplay label="Reps" value={ejercicio.repeticiones ?? 0} />
            </div>
          </div>

          {videoUrl && (
            <div className="flex justify-center">
              <button
                onClick={() => window.open(videoUrl, '_blank', 'noopener,noreferrer')}
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

function DiaCard({ dia, isOpen, onToggle }) {
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
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function MiRutina() {
  const [rutina, setRutina] = useState(null);
  const [sinRutina, setSinRutina] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [diasAbiertos, setDiasAbiertos] = useState(new Set());

  const nombre = localStorage.getItem('nombre') ?? localStorage.getItem('usuario') ?? 'Alumno';

  useEffect(() => {
    usuarios.getMiRutina()
      .then((data) => {
        if (!data) {
          setSinRutina(true);
          return;
        }
        setRutina(data);
        if (data.dias?.length > 0) {
          setDiasAbiertos(new Set([data.dias[0].id]));
        }
      })
      .catch((err) => {
        const msg = String(err?.message ?? '');
        if (msg.includes('404') || msg.toLowerCase().includes('not found')) {
          setSinRutina(true);
        } else {
          setError('No se pudo cargar tu rutina. Intentá de nuevo.');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleDia = (diaId) => {
    setDiasAbiertos((prev) => {
      const next = new Set(prev);
      if (next.has(diaId)) next.delete(diaId);
      else next.add(diaId);
      return next;
    });
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
        <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-2xl p-5 flex items-center gap-3">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-2xl mx-auto space-y-5">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 flex items-center gap-4">
          <div className="bg-violet-700 p-3 rounded-xl shrink-0">
            <Dumbbell className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-gray-900">Bienvenido/a, {nombre}</h1>
            <p className="text-sm text-gray-400">Tu Rutina de Entrenamiento</p>
          </div>
        </div>

        {sinRutina || !rutina ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-10 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-14 h-14 rounded-full bg-violet-50 flex items-center justify-center">
                <Dumbbell className="h-7 w-7 text-violet-300" />
              </div>
            </div>
            <p className="text-gray-500 font-medium">
              Tu entrenador todavía no te asignó una rutina
            </p>
          </div>
        ) : (
          <>
            {(rutina.dias?.length ?? 0) === 0 && (
              <p className="text-center text-gray-400 py-12">Esta rutina no tiene días cargados.</p>
            )}
            {rutina.dias?.map((dia) => (
              <DiaCard
                key={dia.id}
                dia={dia}
                isOpen={diasAbiertos.has(dia.id)}
                onToggle={() => toggleDia(dia.id)}
              />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
