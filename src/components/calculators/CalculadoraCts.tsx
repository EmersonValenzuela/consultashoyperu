import React, { useState } from 'react';
import { PiggyBank, CheckCircle2 } from 'lucide-react';

export default function CalculadoraCts() {
  const [sueldo, setSueldo] = useState<string>('3000');
  const [asignacionFamiliar, setAsignacionFamiliar] = useState<boolean>(false);
  const [ultimaGratificacion, setUltimaGratificacion] = useState<string>('3000');
  const [meses, setMeses] = useState<number>(6);
  const [dias, setDias] = useState<number>(0);

  const montoAsignacion = asignacionFamiliar ? 102.5 : 0;
  const parsedSueldo = parseFloat(sueldo) || 0;
  const parsedGrati = parseFloat(ultimaGratificacion) || 0;

  // Remuneración computable = Sueldo + Asig + (1/6 de la gratificación previa)
  const sextoGrati = parsedGrati / 6;
  const remuneracionComputable = parsedSueldo + montoAsignacion + sextoGrati;

  const ctsMeses = Math.round(((remuneracionComputable / 12) * meses) * 100) / 100;
  const ctsDias = Math.round(((remuneracionComputable / 360) * dias) * 100) / 100;
  const total = Math.round((ctsMeses + ctsDias) * 100) / 100;

  const formatMoney = (val: number) => `S/ ${val.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
          <PiggyBank className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Calculadora de CTS</h2>
          <p className="text-xs text-slate-500">Compensación por Tiempo de Servicios (Depósitos de Mayo y Noviembre)</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Sueldo Básico (S/)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-medium">S/</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={sueldo}
                onChange={(e) => setSueldo(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-base"
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Última Gratificación recibida (S/)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 font-medium">S/</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={ultimaGratificacion}
                onChange={(e) => setUltimaGratificacion(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-base"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Meses trabajados en el semestre
            </label>
            <input
              type="number"
              min="0"
              max="6"
              value={meses}
              onChange={(e) => setMeses(Math.min(6, Math.max(0, parseInt(e.target.value, 10) || 0)))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-base"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Días adicionales (opcional)
            </label>
            <input
              type="number"
              min="0"
              max="29"
              value={dias}
              onChange={(e) => setDias(Math.min(29, Math.max(0, parseInt(e.target.value, 10) || 0)))}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-base"
            />
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={asignacionFamiliar}
              onChange={(e) => setAsignacionFamiliar(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
            />
            <span className="text-sm text-slate-700 font-medium">
              Recibo Asignación Familiar (+S/ 102.50)
            </span>
          </label>
        </div>
      </div>

      {/* Resultados */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm text-slate-600">
            <span>1/6 Gratificación incorporada:</span>
            <span className="font-semibold text-slate-800">{formatMoney(sextoGrati)}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-slate-600">
            <span>Remuneración Computable:</span>
            <span className="font-semibold text-slate-800">{formatMoney(remuneracionComputable)}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-slate-600">
            <span>CTS por meses ({meses}/12):</span>
            <span className="font-semibold text-slate-800">{formatMoney(ctsMeses)}</span>
          </div>
          {dias > 0 && (
            <div className="flex justify-between items-center text-sm text-slate-600">
              <span>CTS por días ({dias}/360):</span>
              <span className="font-semibold text-slate-800">{formatMoney(ctsDias)}</span>
            </div>
          )}
          <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
            <span className="text-base font-bold text-slate-900">Total CTS a Depositar:</span>
            <span className="text-2xl font-black text-indigo-600">{formatMoney(total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500" /> D.S. N.º 001-97-TR (Texto Único Ordenado de la Ley de CTS)
        </span>
        <span>Referencial</span>
      </div>
    </div>
  );
}
