import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Dumbbell, ArrowLeft, Plus, Trash2, Save, CalendarDays, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';
import { rutinas, diasRutina, ejerciciosBase, ejerciciosDia, usuarios } from '../services/api';

const TOTAL_DIAS = 7;

function EjercicioRow({ ejercicio, index, diaId, biblioteca, onUpdate, onSelectBase, onDelete }) {
  const [sugerencias, setSugerencias] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const upd = (field) => (e) => onUpdate(diaId, ejercicio.localId, field, e.target.value);

  const handleNombreChange = (e) => {
    const valor = e.target.value;
    onUpdate(diaId, ejercicio.localId, 'nombre', valor);
    if (valor.trim().length >= 1) {
      const filtradas = biblioteca
        .filter((b) => b.nombre.toLowerCase().includes(valor.toLowerCase()))
        .slice(0, 6);
      setSugerencias(filtradas);
      setDropdownOpen(filtradas.length > 0);
    } else {
      setSugerencias([]);
      setDropdownOpen(false);
    }
  };

  const handleSelect = (base) => {
    onSelectBase(diaId, ejercicio.localId, base);
    setSugerencias([]);
    setDropdownOpen(false);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-800 text-white text-xs flex items-center justify-center font-semibold">
          {index + 1}
        </span>

        <div className="relative flex-1 min-w-40">
          <Input
            value={ejercicio.nombre}
            onChange={handleNombreChange}
            onBlur={() => setTimeout(() => setDropdownOpen(false), 150)}
            placeholder="Nombre del ejercicio"
            className={ejercicio.baseId ? 'border-green-400 bg-green-50' : ''}
          />
          {dropdownOpen && (
            <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
              {sugerencias.map((base) => (
                <button
                  key={base.id}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => handleSelect(base)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-700 transition-colors"
                >
                  {base.nombre}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 whitespace-nowrap">KG</span>
          <Input
            type="number"
            value={ejercicio.kg}
            onChange={upd('kg')}
            placeholder="0"
            className="w-16 text-center"
            min={0}
            step={0.5}
          />
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 whitespace-nowrap">Series</span>
          <Input
            type="number"
            value={ejercicio.series}
            onChange={upd('series')}
            className="w-14 text-center"
            min={0}
          />
        </div>

        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 whitespace-nowrap">Reps</span>
          <Input
            type="number"
            value={ejercicio.reps}
            onChange={upd('reps')}
            className="w-14 text-center"
            min={0}
          />
        </div>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => onDelete(diaId, ejercicio.localId)}
          className="flex-shrink-0 text-red-400 hover:text-red-600 hover:bg-red-50"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {ejercicio.baseId ? (
        <p className="pl-8 text-xs text-green-600">✓ Ejercicio de la biblioteca</p>
      ) : (
        <div className="flex gap-2 pl-8">
          <Input
            value={ejercicio.urlImagen}
            onChange={upd('urlImagen')}
            placeholder="URL imagen (opcional)"
            className="flex-1 text-xs"
          />
          <Input
            value={ejercicio.urlVideo}
            onChange={upd('urlVideo')}
            placeholder="URL video (opcional)"
            className="flex-1 text-xs"
          />
        </div>
      )}
    </div>
  );
}

function DiaCard({ dia, biblioteca, onAddEjercicio, onUpdateEjercicio, onSelectBase, onDeleteEjercicio }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-3 bg-gray-800">
        <span className="text-white font-bold text-sm tracking-wide">DÍA {dia.numeroDia}</span>
        {dia.descripcion && (
          <span className="text-gray-300 text-sm">{dia.descripcion}</span>
        )}
      </div>

      <div className="p-4 space-y-2">
        {dia.ejercicios.length === 0 ? (
          <p className="text-center text-gray-400 text-sm py-4">
            Sin ejercicios. Agregá el primero.
          </p>
        ) : (
          dia.ejercicios.map((ej, idx) => (
            <EjercicioRow
              key={ej.localId}
              ejercicio={ej}
              index={idx}
              diaId={dia.id}
              biblioteca={biblioteca}
              onUpdate={onUpdateEjercicio}
              onSelectBase={onSelectBase}
              onDelete={onDeleteEjercicio}
            />
          ))
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onAddEjercicio(dia.id)}
          className="w-full mt-1 gap-1.5 border-dashed"
        >
          <Plus className="h-3.5 w-3.5" />
          Agregar ejercicio
        </Button>
      </div>
    </div>
  );
}

export function CreateRoutine() {
  const navigate = useNavigate();

  const [biblioteca, setBiblioteca] = useState([]);
  const [alumnos, setAlumnos] = useState([]);

  const [nombreAlumno, setNombreAlumno] = useState('');
  const [alumnoId, setAlumnoId] = useState(null);
  const [sugerenciasAlumno, setSugerenciasAlumno] = useState([]);
  const [dropdownAlumnoOpen, setDropdownAlumnoOpen] = useState(false);

  const [rutinaId, setRutinaId] = useState(null);
  const [creandoRutina, setCreandoRutina] = useState(false);
  const [errorRutina, setErrorRutina] = useState('');

  const [dias, setDias] = useState([]);
  const [diaModalOpen, setDiaModalOpen] = useState(false);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [diaDescripcion, setDiaDescripcion] = useState('');
  const [creandoDia, setCreandoDia] = useState(false);
  const [errorDia, setErrorDia] = useState('');

  const [guardando, setGuardando] = useState(false);
  const [errorGuardado, setErrorGuardado] = useState('');

  useEffect(() => {
    ejerciciosBase.getAll().then(setBiblioteca).catch(() => {});
    usuarios.getAlumnos().then(setAlumnos).catch(() => {});
  }, []);

  const diasUsados = new Set(dias.map((d) => d.numeroDia));

  const handleNombreAlumnoChange = (e) => {
    const valor = e.target.value;
    setNombreAlumno(valor);
    setAlumnoId(null);
    if (errorRutina) setErrorRutina('');
    if (valor.trim().length >= 1) {
      const filtradas = alumnos
        .filter((a) => a.nombreUsuario.toLowerCase().includes(valor.toLowerCase()))
        .slice(0, 6);
      setSugerenciasAlumno(filtradas);
      setDropdownAlumnoOpen(filtradas.length > 0);
    } else {
      setSugerenciasAlumno([]);
      setDropdownAlumnoOpen(false);
    }
  };

  const handleSelectAlumno = (alumno) => {
    setNombreAlumno(alumno.nombreUsuario);
    setAlumnoId(alumno.id);
    setSugerenciasAlumno([]);
    setDropdownAlumnoOpen(false);
  };

  const handleCrearRutina = async () => {
    if (!nombreAlumno.trim()) {
      setErrorRutina('Ingresá el nombre del alumno');
      return;
    }
    setCreandoRutina(true);
    setErrorRutina('');
    try {
      const data = await rutinas.create({ nombreAlumno: nombreAlumno.trim() });
      setRutinaId(data.id);
      setDiaModalOpen(true);
    } catch {
      setErrorRutina('Error al crear la rutina. Intentá de nuevo.');
    } finally {
      setCreandoRutina(false);
    }
  };

  const handleCerrarDiaModal = (open) => {
    if (!open) {
      setDiaSeleccionado(null);
      setDiaDescripcion('');
      setErrorDia('');
    }
    setDiaModalOpen(open);
  };

  const handleConfirmarDia = async () => {
    if (!diaSeleccionado) return;
    setCreandoDia(true);
    setErrorDia('');
    try {
      const data = await diasRutina.create({
        rutinaId,
        numero: diaSeleccionado,
        descripcion: diaDescripcion.trim(),
      });
      setDias((prev) =>
        [
          ...prev,
          {
            id: data.id,
            numeroDia: diaSeleccionado,
            descripcion: diaDescripcion.trim(),
            ejercicios: [],
          },
        ].sort((a, b) => a.numeroDia - b.numeroDia)
      );
      handleCerrarDiaModal(false);
    } catch {
      setErrorDia('Error al crear el día. Intentá de nuevo.');
    } finally {
      setCreandoDia(false);
    }
  };

  const handleAgregarEjercicio = (diaId) => {
    setDias((prev) =>
      prev.map((d) =>
        d.id === diaId
          ? {
              ...d,
              ejercicios: [
                ...d.ejercicios,
                {
                  localId: `${Date.now()}-${Math.random()}`,
                  nombre: '',
                  baseId: null,
                  kg: '',
                  series: 3,
                  reps: 10,
                  urlImagen: '',
                  urlVideo: '',
                },
              ],
            }
          : d
      )
    );
  };

  const handleUpdateEjercicio = (diaId, localId, field, value) => {
    setDias((prev) =>
      prev.map((d) =>
        d.id === diaId
          ? {
              ...d,
              ejercicios: d.ejercicios.map((e) =>
                e.localId === localId
                  ? { ...e, [field]: value, ...(field === 'nombre' ? { baseId: null } : {}) }
                  : e
              ),
            }
          : d
      )
    );
  };

  const handleSelectBase = (diaId, localId, base) => {
    setDias((prev) =>
      prev.map((d) =>
        d.id === diaId
          ? {
              ...d,
              ejercicios: d.ejercicios.map((e) =>
                e.localId === localId ? { ...e, nombre: base.nombre, baseId: base.id } : e
              ),
            }
          : d
      )
    );
  };

  const handleDeleteEjercicio = (diaId, localId) => {
    setDias((prev) =>
      prev.map((d) =>
        d.id === diaId
          ? { ...d, ejercicios: d.ejercicios.filter((e) => e.localId !== localId) }
          : d
      )
    );
  };

  const handleGuardarRutina = async () => {
    const conNombre = dias.flatMap((d) => d.ejercicios).filter((e) => e.nombre.trim());
    if (conNombre.length === 0) {
      setErrorGuardado('Agregá al menos un ejercicio con nombre antes de guardar.');
      return;
    }
    setGuardando(true);
    setErrorGuardado('');
    try {
      for (const dia of dias) {
        for (const ejercicio of dia.ejercicios) {
          if (!ejercicio.nombre.trim()) continue;

          let baseId = ejercicio.baseId;
          if (!baseId) {
            const base = await ejerciciosBase.create({
              nombre: ejercicio.nombre.trim(),
              imagenUrl: ejercicio.urlImagen || null,
              videoUrl: ejercicio.urlVideo || null,
              esGlobal: false,
            });
            baseId = base.id;
            setBiblioteca((prev) => [...prev, base]);
          }

          await ejerciciosDia.create({
            diaRutinaId: dia.id,
            ejercicioBaseId: baseId,
            kg: parseFloat(ejercicio.kg) || 0,
            series: parseInt(ejercicio.series) || 0,
            repeticiones: parseInt(ejercicio.reps) || 0,
          });
        }
      }

      if (alumnoId) {
        await usuarios.asignarRutina(alumnoId, rutinaId);
      }

      navigate('/alumnos');
    } catch {
      setErrorGuardado('Error al guardar los ejercicios. Intentá de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">

        <Button variant="ghost" onClick={() => navigate('/')} className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </Button>

        <div className="flex items-center gap-3">
          <div className="bg-gray-800 p-3 rounded-xl">
            <Dumbbell className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Crear Rutina</h1>
            <p className="text-sm text-gray-500">Planificá los días y ejercicios del alumno</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nombre del alumno
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Input
                value={nombreAlumno}
                onChange={handleNombreAlumnoChange}
                onBlur={() => setTimeout(() => setDropdownAlumnoOpen(false), 150)}
                placeholder="Ej: Juan Pérez"
                disabled={!!rutinaId}
                className={`text-base w-full ${alumnoId ? 'border-green-400 bg-green-50' : ''}`}
                onKeyDown={(e) => e.key === 'Enter' && !rutinaId && handleCrearRutina()}
              />
              {dropdownAlumnoOpen && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                  {sugerenciasAlumno.map((alumno) => (
                    <button
                      key={alumno.id}
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => handleSelectAlumno(alumno)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-violet-50 hover:text-violet-700 transition-colors"
                    >
                      {alumno.nombreUsuario}
                    </button>
                  ))}
                </div>
              )}
            </div>
            {!rutinaId ? (
              <Button
                onClick={handleCrearRutina}
                disabled={creandoRutina}
                className="gap-2 px-6 shrink-0"
              >
                {creandoRutina && <Loader2 className="h-4 w-4 animate-spin" />}
                Crear Rutina
              </Button>
            ) : (
              <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700 font-medium shrink-0">
                ✓ Rutina creada
              </div>
            )}
          </div>
          {alumnoId && !rutinaId && (
            <p className="text-green-600 text-xs mt-2">
              ✓ Alumno existente — la rutina se asignará automáticamente al guardar
            </p>
          )}
          {errorRutina && <p className="text-red-500 text-sm mt-2">{errorRutina}</p>}
        </div>

        {rutinaId && (
          <>
            {dias.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
                <CalendarDays className="h-14 w-14 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-900 font-semibold mb-1">Sin días agregados</p>
                <p className="text-gray-500 text-sm mb-5">
                  Seleccioná un día para comenzar a planificar
                </p>
                <Button onClick={() => setDiaModalOpen(true)} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Agregar primer día
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {dias.map((dia) => (
                  <DiaCard
                    key={dia.id}
                    dia={dia}
                    biblioteca={biblioteca}
                    onAddEjercicio={handleAgregarEjercicio}
                    onUpdateEjercicio={handleUpdateEjercicio}
                    onSelectBase={handleSelectBase}
                    onDeleteEjercicio={handleDeleteEjercicio}
                  />
                ))}

                {diasUsados.size < TOTAL_DIAS && (
                  <Button
                    variant="outline"
                    onClick={() => setDiaModalOpen(true)}
                    className="w-full gap-2 border-dashed py-5"
                  >
                    <Plus className="h-4 w-4" />
                    Agregar otro día
                  </Button>
                )}
              </div>
            )}

            {dias.length > 0 && (
              <div className="pt-2 pb-8">
                {errorGuardado && (
                  <p className="text-red-500 text-sm text-center mb-3">{errorGuardado}</p>
                )}
                <Button
                  size="lg"
                  onClick={handleGuardarRutina}
                  disabled={guardando}
                  className="w-full gap-2 py-6 text-base"
                >
                  {guardando ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Save className="h-5 w-5" />
                  )}
                  {guardando ? 'Guardando...' : 'Guardar Rutina'}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={diaModalOpen} onOpenChange={handleCerrarDiaModal}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Seleccionar día</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: TOTAL_DIAS }, (_, i) => i + 1).map((n) => {
              const usado = diasUsados.has(n);
              const activo = diaSeleccionado === n;
              return (
                <button
                  key={n}
                  disabled={usado}
                  onClick={() => setDiaSeleccionado(n)}
                  className={`rounded-lg py-3 text-sm font-semibold border transition-all ${
                    usado
                      ? 'bg-gray-100 text-gray-300 border-gray-200 cursor-not-allowed'
                      : activo
                      ? 'bg-gray-800 text-white border-gray-800'
                      : 'bg-white text-gray-700 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                  }`}
                >
                  Día {n}
                </button>
              );
            })}
          </div>

          {diaSeleccionado && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Descripción{' '}
                <span className="text-gray-400 font-normal">(opcional)</span>
              </label>
              <Input
                value={diaDescripcion}
                onChange={(e) => setDiaDescripcion(e.target.value)}
                placeholder="Ej: Piernas, Pecho y Tríceps"
                onKeyDown={(e) => e.key === 'Enter' && handleConfirmarDia()}
                autoFocus
              />
            </div>
          )}

          {errorDia && <p className="text-red-500 text-sm">{errorDia}</p>}

          <DialogFooter>
            <Button
              onClick={handleConfirmarDia}
              disabled={!diaSeleccionado || creandoDia}
              className="w-full gap-2"
            >
              {creandoDia && <Loader2 className="h-4 w-4 animate-spin" />}
              {diaSeleccionado ? `Agregar Día ${diaSeleccionado}` : 'Seleccioná un día'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
