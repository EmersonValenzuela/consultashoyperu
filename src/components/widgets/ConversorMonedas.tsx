import React, { useState } from "react";
import { ArrowRightLeft, Coins } from "lucide-react";

interface Props {
  tasaCompra: number;
  tasaVenta: number;
}

export default function ConversorMonedas({ tasaCompra, tasaVenta }: Props) {
  const [monto, setMonto] = useState<string>("100");
  const [direccion, setDireccion] = useState<"USD_A_PEN" | "PEN_A_USD">(
    "PEN_A_USD",
  ); // Default a Soles a Dolar como busca el usuario

  const parsedMonto = parseFloat(monto) || 0;

  // Si conviertes PEN a USD: usas la tasa de venta del mercado (cuántos dólares compras con tus soles)
  // Si conviertes USD a PEN: usas la tasa de compra del mercado (cuántos soles te pagan por tus dólares)
  const resultado =
    direccion === "PEN_A_USD"
      ? tasaVenta > 0
        ? parsedMonto / tasaVenta
        : 0
      : parsedMonto * tasaCompra;

  const tasaAplicada = direccion === "PEN_A_USD" ? tasaVenta : tasaCompra;

  const formatMoney = (val: number, currency: string) =>
    `${currency === "PEN" ? "S/" : "$"} ${val.toLocaleString("es-PE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const presets =
    direccion === "PEN_A_USD"
      ? [50, 100, 200, 500, 1000]
      : [20, 50, 100, 200, 500];

  return (
    <div className="bg-white rounded-xl shadow-clean border border-ink-100 p-6 sm:p-7 h-full flex flex-col justify-between">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-ink-100">
        <div>
          <h3 className="font-heading font-bold text-ink-950 text-base sm:text-lg flex items-center gap-2">
            <Coins className="w-5 h-5 text-soles-600" />
            {direccion === "PEN_A_USD"
              ? "Cambio de Soles a Dólares (PEN → USD)"
              : "Cambio de Dólares a Soles (USD → PEN)"}
          </h3>
          <p className="text-xs text-ink-500 mt-0.5">
            Tasa referencial aplicada:{" "}
            <strong className="font-tabular text-ink-800">
              S/ {tasaAplicada.toFixed(3)}
            </strong>{" "}
            ({direccion === "PEN_A_USD" ? "tasa de venta" : "tasa de compra"})
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            setDireccion((prev) =>
              prev === "PEN_A_USD" ? "USD_A_PEN" : "PEN_A_USD",
            )
          }
          className="inline-flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-xs font-bold bg-slate-50 hover:bg-slate-100 border border-ink-200 text-ink-800 transition-colors self-start sm:self-auto cursor-pointer"
        >
          <ArrowRightLeft className="w-3.5 h-3.5 text-carmesi-600" />
          <span>Invertir cambio</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        {/* Entrada */}
        <div className="md:col-span-6 space-y-2">
          <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600">
            {direccion === "PEN_A_USD"
              ? "Tienes en Soles (PEN)"
              : "Tienes en Dólares (USD)"}
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-ink-400 font-bold font-tabular text-lg">
              {direccion === "PEN_A_USD" ? "S/" : "$"}
            </span>
            <input
              type="number"
              step="any"
              min="0"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-50/70 border border-ink-200 rounded-lg text-ink-950 font-bold font-tabular text-2xl focus:outline-none focus:ring-2 focus:ring-carmesi-600 focus:bg-white transition-all"
              placeholder="0.00"
            />
          </div>

          {/* Presets rápidos */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] text-ink-400 mr-1">Rápido:</span>
            {presets.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setMonto(p.toString())}
                className="px-2 py-0.5 rounded text-[11px] font-bold font-tabular bg-slate-100 hover:bg-slate-200 text-ink-700 transition-colors"
              >
                {direccion === "PEN_A_USD" ? `S/ ${p}` : `$${p}`}
              </button>
            ))}
          </div>
        </div>

        {/* Resultado */}
        <div className="md:col-span-6 bg-gradient-to-br from-slate-50 to-amber-50/30 border border-ink-200 rounded-xl p-5 text-center md:text-right">
          <span className="block text-xs font-semibold text-ink-500 uppercase tracking-wider mb-1">
            {direccion === "PEN_A_USD"
              ? "Obtienes en dólares estadounidenses"
              : "Obtienes en soles peruanos"}
          </span>
          <div className="text-3xl sm:text-4xl font-black font-tabular text-carmesi-700 tracking-tight leading-none my-1">
            {formatMoney(resultado, direccion === "PEN_A_USD" ? "USD" : "PEN")}
          </div>
          <span className="text-[11px] text-ink-400 block mt-2">
            * Cálculo sin comisiones por transferencia interbancaria.
          </span>
        </div>
      </div>
    </div>
  );
}
