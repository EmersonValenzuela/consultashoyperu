import React, { useState } from 'react';
import { Briefcase, CheckCircle2, Info } from 'lucide-react';

export default function CalculadoraGratificacion() {
  const [sueldo, setSueldo] = useState<string>('3000');
  const [asignacionFamiliar, setAsignacionFamiliar] = useState<boolean>(false);
  const [meses, setMeses] = useState<number>(6);
  const [promedioVariables, setPromedioVariables] = useState<string>('0');
  const [tipoSeguro, setTipoSeguro] = useState<'essalud' | 'eps'>('essalud');

  // RMV vigente: S/ 1,025.00 -> Asignación Familiar 10% = S/ 102.50
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
    <div className="bg-white rounded-xl shadow-clean border border-ink-100 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-ink-100">
        <div className="w-10 h-10 rounded-lg bg-carmesi-50 text-carmesi-700 flex items-center justify-center border border-carmesi-200">
          <Briefcase className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-ink-950">Calculadora de Gratificación</h2>
          <p className="text-xs text-ink-500">Cálculo laboral oficial Sunafil para Julio (Fiestas Patrias) y Diciembre (Navidad)</p>
        </div>
      </div>

      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 mb-2">
            Sueldo Básico Mensual (S/)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-ink-400 font-bold font-tabular">S/</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={sueldo}
              onChange={(e) => setSueldo(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-ink-200 rounded-lg text-ink-950 font-bold font-tabular text-lg focus:outline-none focus:ring-2 focus:ring-carmesi-600 focus:bg-white transition-all"
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 mb-2">
              Meses completos trabajados en el semestre
            </label>
            <select
              value={meses}
              onChange={(e) => setMeses(parseInt(e.target.value))}
              className="w-full px-3 py-2.5 bg-slate-50/70 border border-ink-200 rounded-lg text-ink-950 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-carmesi-600 focus:bg-white"
            >
              {[1, 2, 3, 4, 5, 6].map((m) => (
                <option key={m} value={m}>
                  {m} {m === 1 ? 'mes' : 'meses'} {m === 6 ? '(Semestre completo)' : ''}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 mb-2">
              Promedio comisiones / horas extras (S/)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2 text-ink-400 font-tabular font-medium">S/</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={promedioVariables}
                onChange={(e) => setPromedioVariables(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50/70 border border-ink-200 rounded-lg text-ink-950 font-semibold font-tabular text-sm focus:outline-none focus:ring-2 focus:ring-carmesi-600 focus:bg-white"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Asignación familiar checkbox */}
          <label className="flex items-center gap-3 p-3.5 bg-slate-50/70 border border-ink-200 rounded-lg cursor-pointer hover:bg-slate-100/70 transition-colors">
            <input
              type="checkbox"
              checked={asignacionFamiliar}
              onChange={(e) => setAsignacionFamiliar(e.target.checked)}
              className="w-4 h-4 text-carmesi-600 rounded border-ink-300 focus:ring-carmesi-500"
            />
            <div className="text-xs">
              <span className="font-bold text-ink-900 block">Asignación Familiar</span>
              <span className="text-ink-500 text-[11px]">+S/ 102.50 (10% de la RMV)</span>
            </div>
          </label>

          {/* Seguro médico */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 mb-2">
              Tipo de Seguro de Salud
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTipoSeguro('essalud')}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold border transition-all ${
                  tipoSeguro === 'essalud'
                    ? 'bg-carmesi-700 text-white border-carmesi-700 shadow-sm'
                    : 'bg-slate-50 text-ink-700 border-ink-200 hover:bg-slate-100'
                }`}
              >
                EsSalud (+9%)
              </button>
              <button
                type="button"
                onClick={() => setTipoSeguro('eps')}
                className={`py-2 px-2.5 rounded-lg text-xs font-bold border transition-all ${
                  tipoSeguro === 'eps'
                    ? 'bg-carmesi-700 text-white border-carmesi-700 shadow-sm'
                    : 'bg-slate-50 text-ink-700 border-ink-200 hover:bg-slate-100'
                }`}
              >
                EPS (+6.75%)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Desglose de Resultados */}
      <div className="bg-slate-50/90 rounded-xl p-5 border border-ink-200/80 space-y-3">
        <div className="flex items-center justify-between text-xs text-ink-600 pb-2 border-b border-ink-200">
          <span>Remuneración Computable</span>
          <span className="font-bold font-tabular text-ink-900">{formatMoney(remuneracionComputable)}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-ink-600 pb-2 border-b border-ink-200">
          <span>Gratificación Legal proporcional ({meses}/6)</span>
          <span className="font-bold font-tabular text-ink-900">{formatMoney(gratificacion)}</span>
        </div>
        <div className="flex items-center justify-between text-xs text-ink-600 pb-2 border-b border-ink-200">
          <span>Bonificación Extraordinaria ({tipoSeguro === 'essalud' ? '9%' : '6.75%'})</span>
          <span className="font-bold font-tabular text-carmesi-700">+{formatMoney(bonificacion)}</span>
        </div>
        <div className="flex items-center justify-between pt-2">
          <div>
            <span className="text-xs font-bold text-ink-900 block">Total a Recibir (Neto)</span>
            <span className="text-[11px] text-ink-500">Monto libre de aportes de AFP/ONP</span>
          </div>
          <span className="font-tabular text-2xl sm:text-3xl font-black text-carmesi-700 leading-none">
            {formatMoney(total)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-ink-400">
        <span className="flex items-center gap-1 font-medium text-emerald-700">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Ley N° 27735 y Ley N° 30334 (Inafectación permanente)
        </span>
        <span className="font-tabular">SUNAFIL Perú</span>
      </div>
    </div>
  );
}
