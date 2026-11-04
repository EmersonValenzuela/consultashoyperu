import React, { useState } from 'react';
import { Briefcase, CheckCircle2 } from 'lucide-react';

export default function CalculadoraGratificacion() {
  const [sueldo, setSueldo] = useState<string>('3000');
  const [asignacionFamiliar, setAsignacionFamiliar] = useState<boolean>(false);
  const [meses, setMeses] = useState<number>(6);
  const [promedioVariables, setPromedioVariables] = useState<string>('0');
  const [tipoSeguro, setTipoSeguro] = useState<'essalud' | 'eps'>('essalud');

  // Constante RMV vigente 2026: 1025.00 -> 10% = 102.50
  const montoAsignacion = asignacionFamiliar ? 102.5 : 0;
  const parsedSueldo = parseFloat(sueldo) || 0;
  const parsedVariables = parseFloat(promedioVariables) || 0;

  const remuneracionComputable = parsedSueldo + montoAsignacion + parsedVariables;
  const gratificacion = Math.round((remuneracionComputable * (meses / 6)) * 100) / 100;
  const tasaBonificacion = tipoSeguro === 'essalud' ? 0.09 : 0.0675;
  const bonificacion = Math.round((gratificacion * tasaBonificacion) * 100) / 100;
  const total = Math.round((gratificacion + bonificacion) * 100) / 100;

  const formatMoney = (val: number) => `S/ ${val.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center">
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Calculadora de Gratificación</h2>
          <p className="text-xs text-slate-500">Cálculo de Fiestas Patrias (Julio) y Navidad (Diciembre) con Bonificación Extraordinaria</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
            Sueldo Básico Mensual (S/)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400 font-medium">S/</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={sueldo}
              onChange={(e) => setSueldo(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-lg"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Meses completos trabajados
            </label>
            <select
              value={meses}
              onChange={(e) => setMeses(parseInt(e.target.value, 10))}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white text-sm"
            >
              {[6, 5, 4, 3, 2, 1].map((m) => (
                <option key={m} value={m}>
                  {m} {m === 1 ? 'mes' : 'meses'} (Semestre {m === 6 ? 'completo' : 'parcial'})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
              Régimen de Salud (Bonificación)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTipoSeguro('essalud')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                  tipoSeguro === 'essalud'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                EsSalud (+9%)
              </button>
              <button
                type="button"
                onClick={() => setTipoSeguro('eps')}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all border ${
                  tipoSeguro === 'eps'
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                EPS (+6.75%)
              </button>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={asignacionFamiliar}
              onChange={(e) => setAsignacionFamiliar(e.target.checked)}
              className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
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
            <span>Remuneración Computable:</span>
            <span className="font-semibold text-slate-800">{formatMoney(remuneracionComputable)}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-slate-600">
            <span>Gratificación Proporcional:</span>
            <span className="font-semibold text-slate-800">{formatMoney(gratificacion)}</span>
          </div>
          <div className="flex justify-between items-center text-sm text-slate-600">
            <span>Bonificación Extraordinaria ({tipoSeguro === 'essalud' ? '9%' : '6.75%'}):</span>
            <span className="font-semibold text-emerald-600">{formatMoney(bonificacion)}</span>
          </div>
          <div className="border-t border-slate-200 pt-3 flex justify-between items-center">
            <span className="text-base font-bold text-slate-900">Total a Percibir:</span>
            <span className="text-2xl font-black text-emerald-600">{formatMoney(total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Ley N.º 27735 y Ley N.º 30334 (Inafecto de aportes previsionales)
        </span>
        <span>Referencial</span>
      </div>
    </div>
  );
}
