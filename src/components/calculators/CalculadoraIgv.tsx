import React, { useState } from 'react';
import { Calculator, ArrowRightLeft, CheckCircle2 } from 'lucide-react';

export default function CalculadoraIgv() {
  const [monto, setMonto] = useState<string>('1000');
  const [tipo, setTipo] = useState<'base' | 'total'>('base');

  const parsedMonto = parseFloat(monto) || 0;
  const tasa = 0.18;

  let base = 0;
  let igv = 0;
  let total = 0;

  if (tipo === 'base') {
    base = parsedMonto;
    igv = Math.round(base * tasa * 100) / 100;
    total = Math.round((base + igv) * 100) / 100;
  } else {
    total = parsedMonto;
    base = Math.round((total / (1 + tasa)) * 100) / 100;
    igv = Math.round((total - base) * 100) / 100;
  }

  const formatMoney = (val: number) => `S/ ${val.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="bg-white rounded-xl shadow-clean border border-ink-100 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-ink-100">
        <div className="w-10 h-10 rounded-lg bg-carmesi-50 text-carmesi-700 flex items-center justify-center border border-carmesi-200">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-ink-950">Calculadora de IGV (18%)</h2>
          <p className="text-xs text-ink-500">Desglose oficial de Base Imponible, IGV e Importe Total SUNAT</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 mb-2">
            Monto a calcular (S/)
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-ink-400 font-bold font-tabular">S/</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-ink-200 rounded-lg text-ink-950 font-bold font-tabular text-lg focus:outline-none focus:ring-2 focus:ring-carmesi-600 focus:bg-white transition-all"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 mb-2">
            Modalidad del monto ingresado
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTipo('base')}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all border ${
                tipo === 'base'
                  ? 'bg-carmesi-700 text-white border-carmesi-700 shadow-sm'
                  : 'bg-slate-50 text-ink-700 border-ink-200 hover:bg-slate-100'
              }`}
            >
              Sin IGV (Subtotal)
            </button>
            <button
              type="button"
              onClick={() => setTipo('total')}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all border ${
                tipo === 'total'
                  ? 'bg-carmesi-700 text-white border-carmesi-700 shadow-sm'
                  : 'bg-slate-50 text-ink-700 border-ink-200 hover:bg-slate-100'
              }`}
            >
              Con IGV (Total)
            </button>
          </div>
        </div>
      </div>

      {/* Resultados en Bloque Tabular */}
      <div className="bg-slate-50/90 rounded-xl p-5 border border-ink-200/80">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center divide-y sm:divide-y-0 sm:divide-x divide-ink-200">
          <div className="pt-2 sm:pt-0">
            <span className="block text-xs font-medium text-ink-500 mb-1">Base Imponible (Subtotal)</span>
            <span className="text-xl sm:text-2xl font-bold font-tabular text-ink-900">{formatMoney(base)}</span>
          </div>
          <div className="pt-3 sm:pt-0">
            <span className="block text-xs font-medium text-carmesi-700 mb-1">IGV (18% SUNAT)</span>
            <span className="text-xl sm:text-2xl font-bold font-tabular text-carmesi-700">{formatMoney(igv)}</span>
          </div>
          <div className="pt-3 sm:pt-0">
            <span className="block text-xs font-medium text-ink-950 mb-1">Total Facturado</span>
            <span className="text-xl sm:text-2xl font-bold font-tabular text-ink-950">{formatMoney(total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between text-xs text-ink-500 gap-2">
        <span className="flex items-center gap-1.5 font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          Alícuota legal: 16% IGV + 2% Impuesto de Promoción Municipal (IPM)
        </span>
        <span className="text-[11px] font-tabular text-ink-400">Ley del IGV - D.S. N° 055-99-EF</span>
      </div>
    </div>
  );
}
