import React, { useState } from 'react';
import { PiggyBank, CheckCircle2, Calendar } from 'lucide-react';

export default function CalculadoraCts() {
  const [sueldo, setSueldo] = useState<string>('3000');
  const [asignacionFamiliar, setAsignacionFamiliar] = useState<boolean>(false);
  const [ultimaGratificacion, setUltimaGratificacion] = useState<string>('3000');
  const [meses, setMeses] = useState<number>(6);
  const [dias, setDias] = useState<number>(0);

  const montoAsignacion = asignacionFamiliar ? 102.5 : 0;
  const parsedSueldo = parseFloat(sueldo) || 0;
  const parsedGrati = parseFloat(ultimaGratificacion) || 0;

  // Remuneración computable = Sueldo + Asig + (1/6 de la última gratificación)
  const sextoGrati = parsedGrati / 6;
  const remuneracionComputable = parsedSueldo + montoAsignacion + sextoGrati;

  const ctsMeses = Math.round(((remuneracionComputable / 12) * meses) * 100) / 100;
  const ctsDias = Math.round(((remuneracionComputable / 360) * dias) * 100) / 100;
  const total = Math.round((ctsMeses + ctsDias) * 100) / 100;

  const formatMoney = (val: number) => `S/ ${val.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="bg-white rounded-xl shadow-clean border border-ink-100 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-ink-100">
        <div className="w-10 h-10 rounded-lg bg-carmesi-50 text-carmesi-700 flex items-center justify-center border border-carmesi-200">
          <PiggyBank className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-ink-950">Calculadora de CTS</h2>
          <p className="text-xs text-ink-500">Compensación por Tiempo de Servicios — Depósitos obligatorios de Mayo y Noviembre</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 mb-2">
              Sueldo Básico (S/)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-ink-400 font-bold font-tabular">S/</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={sueldo}
                onChange={(e) => setSueldo(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-ink-200 rounded-lg text-ink-950 font-bold font-tabular text-base focus:outline-none focus:ring-2 focus:ring-carmesi-600 focus:bg-white"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 mb-2">
              Última Gratificación recibida (S/)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-ink-400 font-bold font-tabular">S/</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={ultimaGratificacion}
                onChange={(e) => setUltimaGratificacion(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-ink-200 rounded-lg text-ink-950 font-bold font-tabular text-base focus:outline-none focus:ring-2 focus:ring-carmesi-600 focus:bg-white"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        {/* Asignación familiar checkbox */}
        <label className="flex items-center gap-3 p-3.5 bg-slate-50/70 border border-ink-200 rounded-lg cursor-pointer hover:bg-slate-100/70 transition-colors">
          <input
            type="checkbox"
            checked={asignacionFamiliar}
            onChange={(e) => setAsignacionFamiliar(e.target.checked)}
            className="w-4 h-4 text-carmesi-600 rounded border-ink-300 focus:ring-carmesi-500"
          />
          <div className="text-xs">
            <span className="font-bold text-ink-900 block">Percibo Asignación Familiar</span>
            <span className="text-ink-500 text-[11px]">Suma S/ 102.50 a la base de cálculo (10% de RMV)</span>
          </div>
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 mb-2">
              Meses laborados en el semestre
            </label>
            <select
              value={meses}
              onChange={(e) => setMeses(parseInt(e.target.value))}
              className="w-full px-3 py-2.5 bg-slate-50/70 border border-ink-200 rounded-lg text-ink-950 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-carmesi-600 focus:bg-white"
            >
              {[0, 1, 2, 3, 4, 5, 6].map((m) => (
                <option key={m} value={m}>
                  {m} {m === 1 ? 'mes' : 'meses'} {m === 6 ? '(Semestre completo)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 mb-2">
              Días adicionales (opcional)
            </label>
            <input
              type="number"
              min="0"
              max="29"
              value={dias}
              onChange={(e) => setDias(parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 bg-slate-50/70 border border-ink-200 rounded-lg text-ink-950 font-semibold font-tabular text-sm focus:outline-none focus:ring-2 focus:ring-carmesi-600 focus:bg-white"
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Resultados en Bloque Tabular */}
      <div className="bg-slate-50/90 rounded-xl p-5 border border-ink-200/80 space-y-3">
        <div className="flex items-center justify-between text-xs text-ink-600 pb-2 border-b border-ink-200">
          <span>Remuneración Computable (Sueldo + 1/6 Grati)</span>
          <span className="font-bold font-tabular text-ink-900">{formatMoney(remuneracionComputable)}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-ink-600 pb-2 border-b border-ink-200">
          <span>Sexto de Gratificación integrado</span>
          <span className="font-bold font-tabular text-ink-700">+{formatMoney(sextoGrati)}</span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-xs font-bold text-ink-900 block">Monto a Depositar en Cuenta CTS</span>
            <span className="text-[11px] text-ink-500">Depósito en entidad bancaria o caja financiera</span>
          </div>
          <span className="font-tabular text-2xl sm:text-3xl font-black text-carmesi-700 leading-none">
            {formatMoney(total)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-ink-400">
        <span className="flex items-center gap-1 font-medium text-emerald-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Texto Único Ordenado del D.L. N° 650 (Ley de CTS)
        </span>
        <span className="font-tabular">Regulado por SUNAFIL</span>
      </div>
    </div>
  );
}
