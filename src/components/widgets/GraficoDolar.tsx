import React, { useState, useMemo } from "react";
import { TrendingUp, ArrowUpRight, ArrowDownRight, Share2 } from "lucide-react";

interface PuntoHistorico {
  fecha: string;
  compra: number;
  venta: number;
}

interface Props {
  historico: PuntoHistorico[];
  tasaCompraActual: number;
  tasaVentaActual: number;
  fuente: string;
  shareUrl: string;
}

export default function GraficoDolar({
  historico,
  tasaCompraActual,
  tasaVentaActual,
  fuente,
  shareUrl,
}: Props) {
  const [periodo, setPeriodo] = useState<"7D" | "15D" | "30D" | "90D">("30D");
  const [tipoTasa, setTipoTasa] = useState<"venta" | "compra">("venta");
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Aseguramos datos mínimos
  const datosBase = useMemo(() => {
    if (!historico || historico.length === 0) {
      return [
        { fecha: "Ayer", compra: tasaCompraActual, venta: tasaVentaActual },
        { fecha: "Hoy", compra: tasaCompraActual, venta: tasaVentaActual },
      ];
    }
    return historico;
  }, [historico, tasaCompraActual, tasaVentaActual]);

  // Filtrado según el período seleccionado
  const datos = useMemo(() => {
    const cant =
      periodo === "7D"
        ? 7
        : periodo === "15D"
          ? 15
          : periodo === "30D"
            ? 30
            : 90;
    return datosBase.slice(-cant);
  }, [datosBase, periodo]);

  const valores = useMemo(() => {
    return datos.map((d) => (tipoTasa === "venta" ? d.venta : d.compra));
  }, [datos, tipoTasa]);

  const minVal = Math.min(...valores) * 0.998;
  const maxVal = Math.max(...valores) * 1.002;
  const diffVal = maxVal - minVal || 0.01;

  // Dimensiones del SVG
  const width = 800;
  const height = 260;
  const padding = { top: 25, right: 30, bottom: 40, left: 55 };
  const graphWidth = width - padding.left - padding.right;
  const graphHeight = height - padding.top - padding.bottom;

  const points = useMemo(() => {
    return datos.map((d, i) => {
      const val = tipoTasa === "venta" ? d.venta : d.compra;
      const x = padding.left + (i / Math.max(datos.length - 1, 1)) * graphWidth;
      const y = padding.top + (1 - (val - minVal) / diffVal) * graphHeight;
      return { x, y, data: d, val };
    });
  }, [datos, tipoTasa, minVal, diffVal, graphWidth, graphHeight, padding]);

  const pathD = useMemo(() => {
    if (points.length === 0) return "";
    return points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, "");
  }, [points]);

  const areaD = useMemo(() => {
    if (points.length === 0) return "";
    const first = points[0];
    const last = points[points.length - 1];
    const bottom = padding.top + graphHeight;
    return `${pathD} L ${last.x} ${bottom} L ${first.x} ${bottom} Z`;
  }, [pathD, points, padding, graphHeight]);

  const hoveredPoint =
    hoverIndex !== null && points[hoverIndex]
      ? points[hoverIndex]
      : points[points.length - 1];

  const shareText = encodeURIComponent(
    `Evolución del dólar en Perú (${periodo})\nCompra referencial: S/ ${tasaCompraActual.toFixed(3)}\nVenta referencial: S/ ${tasaVentaActual.toFixed(3)}\nFuente: ${fuente}\nMínimo: S/ ${Math.min(...valores).toFixed(3)} | Máximo: S/ ${Math.max(...valores).toFixed(3)}\n\nConsulta: ${shareUrl}`,
  );

  return (
    <div className="bg-white rounded-xl border border-ink-100 p-6 sm:p-7 shadow-clean space-y-5">
      {/* Cabecera con selector de períodos y tipos de tasa */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-ink-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <TrendingUp className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-heading font-bold text-ink-950 text-base sm:text-lg flex items-center gap-2">
              Tendencia y Evolución del Dólar
            </h3>
            <p className="text-xs text-ink-500">
              Histórico de cotizaciones en Perú ({datos.length} días de registro
              continuo)
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start lg:self-auto">
          {/* Selector Venta / Compra */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-ink-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setTipoTasa("venta")}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                tipoTasa === "venta"
                  ? "bg-white text-carmesi-700 shadow-xs border border-ink-200/60 font-bold"
                  : "text-ink-600 hover:text-ink-900"
              }`}
            >
              Venta
            </button>
            <button
              type="button"
              onClick={() => setTipoTasa("compra")}
              className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                tipoTasa === "compra"
                  ? "bg-white text-emerald-700 shadow-xs border border-ink-200/60 font-bold"
                  : "text-ink-600 hover:text-ink-900"
              }`}
            >
              Compra
            </button>
          </div>

          {/* Selector de Rango de Días */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-ink-200 text-xs font-semibold">
            {(["7D", "15D", "30D", "90D"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriodo(p)}
                className={`px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                  periodo === p
                    ? "bg-ink-950 text-white shadow-xs font-bold"
                    : "text-ink-600 hover:text-ink-900 hover:bg-slate-200/50"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Compartir WhatsApp */}
          <a
            href={`https://api.whatsapp.com/send?text=${shareText}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
            title="Compartir gráfico"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Compartir</span>
          </a>
        </div>
      </div>

      {/* Indicadores rápidos del período */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 rounded-lg bg-slate-50 border border-ink-100">
          <span className="text-[10px] uppercase font-bold text-ink-500 block">
            {hoveredPoint?.data.fecha
              ? `Fecha: ${hoveredPoint.data.fecha}`
              : "Punto seleccionado"}
          </span>
          <span className="font-tabular text-lg font-black text-ink-950">
            S/{" "}
            {hoveredPoint?.val.toFixed(3) ||
              (tipoTasa === "venta"
                ? tasaVentaActual
                : tasaCompraActual
              ).toFixed(3)}
          </span>
          <span className="text-[10px] text-ink-500 block font-mono mt-0.5">
            {tipoTasa === "venta" ? "Precio de Venta" : "Precio de Compra"}
          </span>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-ink-100">
          <span className="text-[10px] uppercase font-bold text-ink-500 block">
            Mínimo ({periodo})
          </span>
          <span className="font-tabular text-lg font-bold text-emerald-700">
            S/ {Math.min(...valores).toFixed(3)}
          </span>
          <span className="text-[10px] text-emerald-600 flex items-center gap-0.5 mt-0.5">
            <ArrowDownRight className="w-3 h-3" /> Suelo del periodo
          </span>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-ink-100">
          <span className="text-[10px] uppercase font-bold text-ink-500 block">
            Máximo ({periodo})
          </span>
          <span className="font-tabular text-lg font-bold text-carmesi-700">
            S/ {Math.max(...valores).toFixed(3)}
          </span>
          <span className="text-[10px] text-carmesi-600 flex items-center gap-0.5 mt-0.5">
            <ArrowUpRight className="w-3 h-3" /> Techo del periodo
          </span>
        </div>
        <div className="p-3 rounded-lg bg-slate-50 border border-ink-100">
          <span className="text-[10px] uppercase font-bold text-ink-500 block">
            Variación Neta
          </span>
          <span className="font-tabular text-lg font-bold text-ink-800">
            ±{(Math.max(...valores) - Math.min(...valores)).toFixed(3)}
          </span>
          <span className="text-[10px] text-ink-400 block mt-0.5 font-mono">
            Margen de volatilidad
          </span>
        </div>
      </div>

      {/* Gráfico SVG Interactivo */}
      <div className="relative w-full overflow-hidden bg-slate-50/50 rounded-xl border border-ink-100 pt-2 pb-1">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-52 sm:h-64"
          preserveAspectRatio="none"
          onMouseLeave={() => setHoverIndex(null)}
        >
          <defs>
            <linearGradient id="dolarAreaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={tipoTasa === "venta" ? "#e11d48" : "#059669"}
                stopOpacity="0.25"
              />
              <stop
                offset="100%"
                stopColor={tipoTasa === "venta" ? "#e11d48" : "#059669"}
                stopOpacity="0.0"
              />
            </linearGradient>
          </defs>

          {/* Líneas horizontales de cuadrícula */}
          {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
            const y = padding.top + ratio * graphHeight;
            const val = maxVal - ratio * diffVal;
            return (
              <g key={idx}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={width - padding.right}
                  y2={y}
                  stroke="#e2e8f0"
                  strokeDasharray="3 3"
                />
                <text
                  x={padding.left - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-slate-400 font-mono text-[10px]"
                >
                  {val.toFixed(3)}
                </text>
              </g>
            );
          })}

          {/* Área sombreada */}
          {areaD && <path d={areaD} fill="url(#dolarAreaGrad)" />}

          {/* Línea principal */}
          {pathD && (
            <path
              d={pathD}
              fill="none"
              stroke={tipoTasa === "venta" ? "#e11d48" : "#059669"}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* Puntos de datos interactivos */}
          {points.map((p, i) => (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={hoverIndex === i ? 6 : 3.5}
                className={`transition-all ${
                  hoverIndex === i
                    ? tipoTasa === "venta"
                      ? "fill-rose-600 stroke-white stroke-2"
                      : "fill-emerald-600 stroke-white stroke-2"
                    : tipoTasa === "venta"
                      ? "fill-white stroke-rose-600 stroke-2"
                      : "fill-white stroke-emerald-600 stroke-2"
                }`}
              />
              {/* Hotspot de captura para hover */}
              <rect
                x={p.x - Math.max(10, graphWidth / (points.length * 2))}
                y={0}
                width={Math.max(20, graphWidth / points.length)}
                height={height}
                fill="transparent"
                className="cursor-pointer"
                onMouseEnter={() => setHoverIndex(i)}
              />
              {/* Etiquetas de fechas en eje X */}
              {(i === 0 ||
                i === points.length - 1 ||
                i % Math.ceil(points.length / 6) === 0) && (
                <text
                  x={p.x}
                  y={height - 12}
                  textAnchor="middle"
                  className="fill-slate-500 font-mono text-[10px]"
                >
                  {p.data.fecha.slice(5)}
                </text>
              )}
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
