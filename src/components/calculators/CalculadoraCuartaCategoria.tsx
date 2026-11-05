import React, { useState } from 'react';
import { FileText, ArrowRightLeft, ShieldCheck, Info, CheckCircle2, Share2 } from 'lucide-react';

export default function CalculadoraCuartaCategoria() {
  const [monto, setMonto] = useState<string>('2000');
  const [modo, setModo] = useState<'bruto' | 'neto'>('bruto');
  const [tieneSuspension, setTieneSuspension] = useState<boolean>(false);

  const parsedMonto = Math.max(0, parseFloat(monto) || 0);
  const tasaRetencion = 0.08; // 8% SUNAT
  const topeRetencionObligatoria = 1500; // Recibos > S/ 1,500 sufren retención a personas jurídicas

  let montoBruto = 0;
  let montoRetencion = 0;
  let montoNeto = 0;

  if (tieneSuspension) {
    montoBruto = parsedMonto;
    montoRetencion = 0;
    montoNeto = parsedMonto;
  } else if (modo === 'bruto') {
    montoBruto = parsedMonto;
    // Si es mayor a 1,500 o si el usuario quiere ver la retención
    if (montoBruto > topeRetencionObligatoria) {
      montoRetencion = Math.round(montoBruto * tasaRetencion * 100) / 100;
    } else {
      montoRetencion = 0;
    }
    montoNeto = montoBruto - montoRetencion;
  } else {
    // Si ingresó el neto deseado
    montoNeto = parsedMonto;
    if (montoNeto > topeRetencionObligatoria * (1 - tasaRetencion)) {
      montoBruto = Math.round((montoNeto / (1 - tasaRetencion)) * 100) / 100;
      montoRetencion = Math.round((montoBruto - montoNeto) * 100) / 100;
    } else {
      montoBruto = montoNeto;
      montoRetencion = 0;
    }
  }

  const formatMoney = (val: number) =>
    `S/ ${val.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const shareText = encodeURIComponent(
    `🧾 *Cálculo Recibo por Honorarios (4ta Categoría)*\n💵 Monto Bruto a emitir: ${formatMoney(montoBruto)}\n🔻 Retención 8% SUNAT: ${formatMoney(montoRetencion)}\n👉 *NETO A RECIBIR: ${formatMoney(montoNeto)}*\n\nCalcula tus recibos en: https://consultasperu.safezoneperu.com/calculadora-cuarta-categoria/`
  );

  return (
    <div className="bg-white rounded-xl shadow-clean border border-ink-100 p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-ink-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-50 text-sky-700 flex items-center justify-center border border-sky-200">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-ink-950">
              Calculadora de Recibo por Honorarios (Cuarta Categoría)
            </h2>
            <p className="text-xs text-ink-500">
              Cálculo de Retención del 8% de Impuesto a la Renta SUNAT para trabajadores independientes
            </p>
          </div>
        </div>

        <a
          href={`https://api.whatsapp.com/send?text=${shareText}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span>Compartir cálculo</span>
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Formulario */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 mb-1.5">
              {modo === 'bruto' ? 'Monto Bruto pactado en el recibo (S/)' : 'Monto Neto que deseas recibir líquido (S/)'}
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-ink-400 font-bold font-tabular">S/</span>
              <input
                type="number"
                step="50"
                min="0"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-ink-200 rounded-lg text-ink-950 font-tabular font-bold focus:bg-white focus:border-carmesi-600 focus:outline-none transition-colors"
                placeholder="2000"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 mb-1.5">
              Modo de Cálculo
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setModo('bruto')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-colors cursor-pointer ${
                  modo === 'bruto'
                    ? 'bg-ink-950 text-white border-ink-950'
                    : 'bg-slate-50 text-ink-700 border-ink-200 hover:bg-slate-100'
                }`}
              >
                Conozco el monto Bruto
              </button>
              <button
                type="button"
                onClick={() => setModo('neto')}
                className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-colors cursor-pointer ${
                  modo === 'neto'
                    ? 'bg-ink-950 text-white border-ink-950'
                    : 'bg-slate-50 text-ink-700 border-ink-200 hover:bg-slate-100'
                }`}
              >
                Quiero un monto Neto exacto
              </button>
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={tieneSuspension}
                onChange={(e) => setTieneSuspension(e.target.checked)}
                className="w-4 h-4 text-carmesi-600 rounded border-ink-300 focus:ring-carmesi-500 cursor-pointer"
              />
              <span className="text-xs font-semibold text-ink-800">
                Tengo Constancia de Suspensión de Retenciones SUNAT (Formulario 1609)
              </span>
            </label>
          </div>

          <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-xs text-amber-800 space-y-1">
            <strong>Regla SUNAT:</strong>
            <p>
              Si el recibo es emitido a una empresa por un monto <strong>mayor a S/ 1,500</strong>, la empresa debe retener el 8%, a menos que presentes tu constancia de suspensión.
            </p>
          </div>
        </div>

        {/* Resumen */}
        <div className="bg-slate-50 rounded-xl p-5 border border-ink-100 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-500 block">
              Detalle del Recibo por Honorarios Electrónico
            </span>

            <div className="flex justify-between items-center text-sm py-1.5 border-b border-ink-200/60">
              <span className="text-ink-600">Total Honorarios (Bruto):</span>
              <span className="font-bold font-tabular text-ink-950">{formatMoney(montoBruto)}</span>
            </div>

            <div className="flex justify-between items-center text-sm py-1.5 border-b border-ink-200/60 text-carmesi-700">
              <span>Retención Impuesto a la Renta (8%):</span>
              <span className="font-bold font-tabular">
                {montoRetencion > 0 ? `- ${formatMoney(montoRetencion)}` : 'S/ 0.00'}
              </span>
            </div>

            {montoBruto <= topeRetencionObligatoria && !tieneSuspension && (
              <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
                ✓ Al ser menor o igual a S/ 1,500 no aplica retención obligatoria directa por recibo.
              </p>
            )}

            {tieneSuspension && (
              <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
                ✓ Cuentas con suspensión de retenciones aprobada por SUNAT: cobras el 100% íntegro.
              </p>
            )}

            <div className="pt-2">
              <div className="p-4 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-sky-800 block">
                    Neto a Pagar
                  </span>
                  <span className="text-[11px] text-sky-600 font-medium">Monto final que recibes</span>
                </div>
                <div className="font-tabular text-2xl sm:text-3xl font-black text-sky-800">
                  {formatMoney(montoNeto)}
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-ink-400 border-t border-ink-200/60 pt-3">
            Tope mensual para suspensión de 4ta categoría: <strong>S/ 3,755</strong> (aproximado anual: S/ 45,063).
          </div>
        </div>
      </div>
    </div>
  );
}