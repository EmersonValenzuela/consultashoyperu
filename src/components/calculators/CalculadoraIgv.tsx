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
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
          <Calculator className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Calculadora de IGV (18%)</h2>
          <p className="text-xs text-slate-500">Calcula el Subtotal, IGV y Total conforme a la normativa de SUNAT</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
            Monto a calcular (S/)
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400 font-medium">S/</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-lg"
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
            ¿El monto incluye IGV?
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTipo('base')}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all border ${
                tipo === 'base'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Sin IGV (Base)
            </button>
            <button
              type="button"
              onClick={() => setTipo('total')}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold transition-all border ${
                tipo === 'total'
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              Con IGV (Total)
            </button>
          </div>
        </div>
      </div>

      {/* Resultados destacados */}
      <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
        <div className="grid grid-cols-3 gap-4 text-center divide-x divide-slate-200">
          <div>
            <span className="block text-xs font-medium text-slate-500 mb-1">Subtotal (Base)</span>
            <span className="text-base sm:text-xl font-bold text-slate-800">{formatMoney(base)}</span>
          </div>
          <div>
            <span className="block text-xs font-medium text-blue-600 mb-1">IGV (18%)</span>
            <span className="text-base sm:text-xl font-bold text-blue-600">{formatMoney(igv)}</span>
          </div>
          <div>
            <span className="block text-xs font-medium text-slate-900 mb-1">Total a Pagar</span>
            <span className="text-base sm:text-xl font-bold text-slate-900">{formatMoney(total)}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Tasa vigente de IGV: 18% (16% IGV + 2% IPM)
        </span>
        <span>Cálculo referencial</span>
      </div>
    </div>
  );
}
