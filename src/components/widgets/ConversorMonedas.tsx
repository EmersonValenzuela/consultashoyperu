import React, { useState } from 'react';
import { ArrowRightLeft } from 'lucide-react';

interface Props {
  tasaCompra: number;
  tasaVenta: number;
}

export default function ConversorMonedas({ tasaCompra, tasaVenta }: Props) {
  const [monto, setMonto] = useState<string>('100');
  const [direccion, setDireccion] = useState<'USD_A_PEN' | 'PEN_A_USD'>('USD_A_PEN');

  const parsedMonto = parseFloat(monto) || 0;

  // Si conviertes USD a PEN, se usa la tasa de compra (o venta según operación bancaria)
  // USD -> PEN: monto * tasaCompra
  // PEN -> USD: monto / tasaVenta
  const resultado =
    direccion === 'USD_A_PEN'
      ? parsedMonto * tasaCompra
      : tasaVenta > 0
        ? parsedMonto / tasaVenta
        : 0;

  const formatMoney = (val: number, currency: string) =>
    `${currency === 'PEN' ? 'S/' : '$'} ${val.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-slate-900 text-base">Conversor Rápido de Moneda</h3>
        <button
          type="button"
          onClick={() => setDireccion((prev) => (prev === 'USD_A_PEN' ? 'PEN_A_USD' : 'USD_A_PEN'))}
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
        >
          <ArrowRightLeft className="w-3.5 h-3.5" /> Cambiar sentido
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
        <div>
          <label className="block text-xs font-semibold text-slate-500 mb-1">
            {direccion === 'USD_A_PEN' ? 'Tengo Dólares (USD)' : 'Tengo Soles (PEN)'}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2 text-slate-400 font-medium">
              {direccion === 'USD_A_PEN' ? '$' : 'S/'}
            </span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            />
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 text-center sm:text-right">
          <span className="block text-xs font-semibold text-blue-700 mb-0.5">
            {direccion === 'USD_A_PEN' ? 'Recibo aproximadamente' : 'Compro aproximadamente'}
          </span>
          <span className="text-xl sm:text-2xl font-black text-blue-900">
            {formatMoney(resultado, direccion === 'USD_A_PEN' ? 'PEN' : 'USD')}
          </span>
        </div>
      </div>
    </div>
  );
}
