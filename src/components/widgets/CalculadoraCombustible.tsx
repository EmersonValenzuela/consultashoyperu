import React, { useState, useMemo } from 'react';
import { Fuel, Sparkles, Share2, Info, Flame } from 'lucide-react';
import type { CombustibleData } from '../../lib/api';

interface Props {
  combustibles: CombustibleData[];
}

interface VehiculoPreset {
  id: string;
  nombre: string;
  icono: string;
  tipoCombustible: string;
  capacidad: number;
}

const PRESETS: VehiculoPreset[] = [
  { id: 'moto', nombre: 'Moto Lineal', icono: '🏍️', tipoCombustible: 'gasolina_regular', capacidad: 2.8 },
  { id: 'sedan', nombre: 'Auto / Sedán', icono: '🚗', tipoCombustible: 'gasolina_regular', capacidad: 11.5 },
  { id: 'suv', nombre: 'Camioneta / SUV', icono: '🚙', tipoCombustible: 'gasolina_premium', capacidad: 16.0 },
  { id: 'diesel_pick', nombre: 'Pickup / Diésel', icono: '🛻', tipoCombustible: 'diesel', capacidad: 18.0 },
  { id: 'taxi_glp', nombre: 'Taxi GLP', icono: '🚕', tipoCombustible: 'glp_vehicular', capacidad: 35.0 }, // litros
  { id: 'taxi_gnv', nombre: 'Taxi GNV', icono: '🚕', tipoCombustible: 'gnv', capacidad: 15.0 }, // m3
  { id: 'gas_hogar', nombre: 'Gas Hogar (1 Balón)', icono: '🏠', tipoCombustible: 'balon_gas_10kg', capacidad: 1 },
];

export default function CalculadoraCombustible({ combustibles }: Props) {
  const [modo, setModo] = useState<'llenar_tanque' | 'presupuesto_soles'>('llenar_tanque');
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string>('gasolina_regular');
  const [cantidad, setCantidad] = useState<string>('11.5');
  const [presetActivo, setPresetActivo] = useState<string>('sedan');

  const combustibleActual = useMemo(() => {
    return combustibles.find((c) => c.tipo === tipoSeleccionado) || combustibles[0] || {
      tipo: 'gasolina_regular',
      nombre: 'Gasolina Regular',
      unidad: 'galón',
      simbolo_unidad: 'gal',
      precio_promedio: 16.29,
      precio_minimo: 14.79,
      precio_maximo: 18.50,
      fuente: 'Osinergmin / Facilito',
    };
  }, [combustibles, tipoSeleccionado]);

  const numCantidad = Math.max(0.1, parseFloat(cantidad) || 0);

  // Cálculos reactivos instantáneos
  const calculo = useMemo(() => {
    if (modo === 'llenar_tanque') {
      const costoPromedio = numCantidad * combustibleActual.precio_promedio;
      const costoMinimo = numCantidad * combustibleActual.precio_minimo;
      const costoMaximo = numCantidad * combustibleActual.precio_maximo;
      const ahorro = Math.max(0, costoMaximo - costoMinimo);

      return {
        costoPromedio,
        costoMinimo,
        costoMaximo,
        ahorro,
      };
    } else {
      // Modo por presupuesto en soles
      const volumenPromedio = numCantidad / combustibleActual.precio_promedio;
      const volumenMinimo = numCantidad / combustibleActual.precio_maximo;
      const volumenMaximo = numCantidad / combustibleActual.precio_minimo;
      const volumenExtra = Math.max(0, volumenMaximo - volumenPromedio);

      return {
        volumenPromedio,
        volumenMinimo,
        volumenMaximo,
        volumenExtra,
      };
    }
  }, [modo, numCantidad, combustibleActual]);

  const seleccionarPreset = (p: VehiculoPreset) => {
    setPresetActivo(p.id);
    setTipoSeleccionado(p.tipoCombustible);
    if (modo === 'llenar_tanque') {
      setCantidad(p.capacidad.toString());
    }
  };

  const shareText = encodeURIComponent(
    `⛽ *Cálculo de Combustible en Perú*\n` +
    `🚗 Combustible: ${combustibleActual.nombre}\n` +
    (modo === 'llenar_tanque'
      ? `💵 Tanque (${numCantidad} ${combustibleActual.simbolo_unidad}): Aprox. S/ ${calculo.costoPromedio.toFixed(2)}\n` +
        `🟢 En grifo económico: S/ ${calculo.costoMinimo.toFixed(2)}\n` +
        `💡 Ahorras hasta: S/ ${calculo.ahorro.toFixed(2)} por tanque!\n`
      : `💰 Con S/ ${numCantidad}: Recibes ${calculo.volumenPromedio.toFixed(2)} ${combustibleActual.simbolo_unidad} (En grifo barato hasta ${calculo.volumenMaximo.toFixed(2)} ${combustibleActual.simbolo_unidad})\n`) +
    `\nCalcula el tuyo en: https://consultasperu.safezoneperu.com/precios-combustibles-peru/`
  );

  return (
    <div className="bg-white rounded-2xl border border-ink-100 shadow-clean overflow-hidden">
      
      {/* Header de la calculadora */}
      <div className="bg-gradient-to-r from-ink-950 via-ink-900 to-slate-900 text-white p-6 sm:p-7">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 mb-2">
              <Sparkles className="w-3.5 h-3.5" /> Calculadora de Tanque & Ahorro Osinergmin
            </span>
            <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight">
              ¿Cuánto cuesta llenar el tanque de tu vehículo hoy?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Compara el costo en grifos económicos vs. promedio y descubre cuánto dinero puedes ahorrar.
            </p>
          </div>

          {/* Toggle de Modo */}
          <div className="flex items-center bg-white/10 p-1 rounded-xl self-start sm:self-auto border border-white/10">
            <button
              type="button"
              onClick={() => {
                setModo('llenar_tanque');
                setCantidad('11.5');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                modo === 'llenar_tanque'
                  ? 'bg-carmesi-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Tanque lleno
            </button>
            <button
              type="button"
              onClick={() => {
                setModo('presupuesto_soles');
                setCantidad('100');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                modo === 'presupuesto_soles'
                  ? 'bg-carmesi-600 text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Por presupuesto (S/)
            </button>
          </div>
        </div>

        {/* Presets Rápidos de Vehículo */}
        <div className="mt-6 pt-5 border-t border-white/10">
          <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
            Elige un vehículo o tipo de consumo rápido:
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {PRESETS.map((p) => {
              const activo = presetActivo === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => seleccionarPreset(p)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                    activo
                      ? 'bg-white/20 border-amber-400 text-white ring-1 ring-amber-400/50'
                      : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <span className="text-xl mb-1">{p.icono}</span>
                  <span className="text-xs font-bold leading-tight line-clamp-1">{p.nombre}</span>
                  <span className="text-[10px] text-slate-400 mt-0.5 font-mono">
                    {p.id === 'gas_hogar' ? '1 unid' : `${p.capacidad} ${p.id.includes('glp') ? 'L' : p.id.includes('gnv') ? 'm³' : 'gal'}`}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Formulario y Resultados */}
      <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Parámetros */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Tipo de Combustible */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-2">
              Tipo de Combustible
            </label>
            <select
              value={tipoSeleccionado}
              onChange={(e) => {
                setTipoSeleccionado(e.target.value);
                setPresetActivo('');
              }}
              className="w-full bg-slate-50 border border-ink-200 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-ink-900 focus:outline-none focus:ring-2 focus:ring-carmesi-500 focus:bg-white transition-all cursor-pointer"
            >
              {combustibles.map((c) => (
                <option key={c.tipo} value={c.tipo}>
                  {c.nombre} ({c.simbolo_unidad}) — Prom. S/ {c.precio_promedio.toFixed(2)}
                </option>
              ))}
            </select>
            <div className="flex items-center justify-between text-xs text-ink-500 mt-1.5 px-1 font-tabular">
              <span>Mínimo: S/ {combustibleActual.precio_minimo.toFixed(2)}</span>
              <span>Máximo: S/ {combustibleActual.precio_maximo.toFixed(2)}</span>
            </div>
          </div>

          {/* Cantidad / Presupuesto */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-ink-700 mb-2">
              {modo === 'llenar_tanque'
                ? `Capacidad del Tanque (${combustibleActual.unidad}es)`
                : 'Presupuesto en Soles a Cargar'}
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="500"
                value={cantidad}
                onChange={(e) => {
                  setCantidad(e.target.value);
                  setPresetActivo('');
                }}
                className="w-full bg-slate-50 border border-ink-200 rounded-xl px-4 py-3 text-lg font-black font-tabular text-ink-950 focus:outline-none focus:ring-2 focus:ring-carmesi-500 focus:bg-white transition-all"
                placeholder="10"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold font-mono text-ink-500 bg-slate-200/60 px-2 py-1 rounded">
                {modo === 'llenar_tanque' ? combustibleActual.simbolo_unidad : 'PEN (S/)'}
              </span>
            </div>

            {/* Presets rápidos de valor */}
            <div className="flex items-center gap-1.5 mt-2.5">
              <span className="text-[11px] text-ink-400">Rápido:</span>
              {(modo === 'llenar_tanque' ? [5, 10, 15, 20] : [30, 50, 100, 150]).map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => {
                    setCantidad(v.toString());
                    setPresetActivo('');
                  }}
                  className="px-2.5 py-1 text-xs font-mono font-semibold rounded-md bg-slate-100 hover:bg-slate-200 text-ink-700 transition-colors"
                >
                  {modo === 'llenar_tanque' ? `${v} ${combustibleActual.simbolo_unidad}` : `S/ ${v}`}
                </button>
              ))}
            </div>
          </div>

          {/* Tips de ahorro */}
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-900 flex items-start gap-3">
            <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold">Consejo de Osinergmin:</strong>
              El precio del combustible no está regulado en el Perú; cada grifo fija sus tarifas libremente. La diferencia entre grifos en un mismo distrito puede ser de hasta S/ 3.50 por galón.
            </div>
          </div>

        </div>

        {/* Tarjeta de Resultados */}
        <div className="lg:col-span-7 bg-slate-50 border border-ink-200 rounded-xl p-6 sm:p-7 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-ink-200 pb-3 mb-5">
              <div>
                <span className="text-xs uppercase font-bold text-ink-500 tracking-wider">
                  Resultado del Cálculo
                </span>
                <h3 className="font-heading font-black text-ink-950 text-lg sm:text-xl">
                  {combustibleActual.nombre}
                </h3>
              </div>
              <span className="text-[11px] font-mono bg-white border border-ink-200 text-ink-700 px-2.5 py-1 rounded-lg">
                Ref. {combustibleActual.region}
              </span>
            </div>

            {modo === 'llenar_tanque' ? (
              <div className="space-y-4">
                
                {/* Costo Promedio */}
                <div className="bg-white rounded-xl p-4 sm:p-5 border border-ink-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-ink-500 block">Costo Promedio Estimado</span>
                    <span className="text-[11px] text-ink-400">A S/ {combustibleActual.precio_promedio.toFixed(2)} por {combustibleActual.simbolo_unidad}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-tabular font-black text-2xl sm:text-3xl text-ink-950">
                      S/ {calculo.costoPromedio.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Grifo Económico vs Caro */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  
                  {/* Económico */}
                  <div className="bg-emerald-50/80 border border-emerald-300 rounded-xl p-4">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                      Grifo Más Barato
                    </span>
                    <span className="font-tabular font-black text-xl text-emerald-700 block mt-1">
                      S/ {calculo.costoMinimo.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-emerald-600 block mt-0.5">
                      Tarifa: S/ {combustibleActual.precio_minimo.toFixed(2)} / {combustibleActual.simbolo_unidad}
                    </span>
                  </div>

                  {/* Caro */}
                  <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-4">
                    <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
                      Grifo Más Caro
                    </span>
                    <span className="font-tabular font-black text-xl text-rose-700 block mt-1">
                      S/ {calculo.costoMaximo.toFixed(2)}
                    </span>
                    <span className="text-[10px] text-rose-600 block mt-0.5">
                      Tarifa: S/ {combustibleActual.precio_maximo.toFixed(2)} / {combustibleActual.simbolo_unidad}
                    </span>
                  </div>

                </div>

                {/* Banner de Ahorro Potencial */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white rounded-xl p-4 flex items-center justify-between shadow-sm">
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider block text-emerald-100">
                      Ahorro Potencial por Tanqueada
                    </span>
                    <p className="text-xs text-white/90 mt-0.5">
                      Si eliges el grifo más económico de tu zona
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-tabular font-black text-2xl sm:text-3xl text-amber-300">
                      S/ {calculo.ahorro.toFixed(2)}
                    </span>
                  </div>
                </div>

              </div>
            ) : (
              <div className="space-y-4">
                
                {/* Volumen Obtenido */}
                <div className="bg-white rounded-xl p-4 sm:p-5 border border-ink-200 shadow-sm flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-ink-500 block">Combustible Obtenido (Promedio)</span>
                    <span className="text-[11px] text-ink-400">Por S/ {numCantidad.toFixed(2)} invertidos</span>
                  </div>
                  <div className="text-right">
                    <span className="font-tabular font-black text-2xl sm:text-3xl text-ink-950">
                      {calculo.volumenPromedio.toFixed(2)} <span className="text-sm font-semibold text-ink-500">{combustibleActual.simbolo_unidad}</span>
                    </span>
                  </div>
                </div>

                {/* Comparación de Galones */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-emerald-50/80 border border-emerald-300 rounded-xl p-4">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                      En Grifo Barato Obtienes
                    </span>
                    <span className="font-tabular font-black text-xl text-emerald-700 block mt-1">
                      {calculo.volumenMaximo.toFixed(2)} {combustibleActual.simbolo_unidad}
                    </span>
                    <span className="text-[10px] text-emerald-600 block mt-0.5">
                      +{calculo.volumenExtra.toFixed(2)} {combustibleActual.simbolo_unidad} adicionales gratis
                    </span>
                  </div>

                  <div className="bg-rose-50/80 border border-rose-200 rounded-xl p-4">
                    <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider block">
                      En Grifo Caro Obtienes
                    </span>
                    <span className="font-tabular font-black text-xl text-rose-700 block mt-1">
                      {calculo.volumenMinimo.toFixed(2)} {combustibleActual.simbolo_unidad}
                    </span>
                    <span className="text-[10px] text-rose-600 block mt-0.5">
                      Menor rendimiento por sol
                    </span>
                  </div>
                </div>

              </div>
            )}
          </div>

          {/* Footer de acción: Compartir en WhatsApp */}
          <div className="mt-6 pt-4 border-t border-ink-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs text-ink-500 text-center sm:text-left">
              Valores calculados con precios oficiales vigentes ({combustibleActual.vigencia_desde}).
            </span>
            <a
              href={`https://wa.me/?text=${shareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all cursor-pointer w-full sm:w-auto"
            >
              <Share2 className="w-4 h-4" />
              <span>Compartir este cálculo</span>
            </a>
          </div>

        </div>

      </div>

    </div>
  );
}
