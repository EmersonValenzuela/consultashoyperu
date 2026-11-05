import React, { useState } from 'react';
import { Wallet, Info, CheckCircle2, AlertCircle, Building, ShieldCheck, Share2 } from 'lucide-react';

export default function CalculadoraSueldoNeto() {
  const [sueldoBruto, setSueldoBruto] = useState<string>('3000');
  const [sistemaPension, setSistemaPension] = useState<'onp' | 'afp_integra' | 'afp_prima' | 'afp_profuturo' | 'afp_habitat'>('afp_integra');
  const [tipoComision, setTipoComision] = useState<'flujo' | 'mixta'>('mixta');
  const [asignacionFamiliar, setAsignacionFamiliar] = useState<boolean>(false);
  const [hijos, setHijos] = useState<string>('0');

  const brutoBase = Math.max(0, parseFloat(sueldoBruto) || 0);
  const RMV = 1230;
  const montoAsignacion = asignacionFamiliar ? RMV * 0.10 : 0;
  const ingresoTotalBruto = brutoBase + montoAsignacion;

  // Tasas de AFP u ONP en Perú (referenciales)
  let tasaPension = 0.13; // ONP fija
  let nombrePension = 'ONP (Sistema Nacional)';

  if (sistemaPension === 'afp_integra') {
    tasaPension = tipoComision === 'mixta' ? 0.1170 : 0.1325;
    nombrePension = 'AFP Integra';
  } else if (sistemaPension === 'afp_prima') {
    tasaPension = tipoComision === 'mixta' ? 0.1188 : 0.1330;
    nombrePension = 'AFP Prima';
  } else if (sistemaPension === 'afp_profuturo') {
    tasaPension = tipoComision === 'mixta' ? 0.1237 : 0.1339;
    nombrePension = 'AFP Profuturo';
  } else if (sistemaPension === 'afp_habitat') {
    tasaPension = tipoComision === 'mixta' ? 0.1170 : 0.1317;
    nombrePension = 'AFP Habitat';
  }

  const descuentoPension = Math.round(ingresoTotalBruto * tasaPension * 100) / 100;

  // Cálculo de Impuesto a la Renta de Quinta Categoría (Proyección anual SUNAT)
  const UIT = 5350; // UIT 2026 proyectada/vigente
  const deduccion7Uit = 7 * UIT; // S/ 37,450

  // 12 sueldos + 2 gratificaciones (julio y diciembre) + 9% bono extraordinario
  const ingresosAnualesProyectados = (ingresoTotalBruto * 12) + (ingresoTotalBruto * 2 * 1.09);
  const rentaNetaImponible = Math.max(0, ingresosAnualesProyectados - deduccion7Uit);

  let impuestoAnual5ta = 0;
  if (rentaNetaImponible > 0) {
    const tramo1 = Math.min(rentaNetaImponible, 5 * UIT);
    impuestoAnual5ta += tramo1 * 0.08;

    if (rentaNetaImponible > 5 * UIT) {
      const tramo2 = Math.min(rentaNetaImponible - 5 * UIT, 15 * UIT);
      impuestoAnual5ta += tramo2 * 0.14;
    }
    if (rentaNetaImponible > 20 * UIT) {
      const tramo3 = Math.min(rentaNetaImponible - 20 * UIT, 15 * UIT);
      impuestoAnual5ta += tramo3 * 0.17;
    }
    if (rentaNetaImponible > 35 * UIT) {
      const tramo4 = Math.min(rentaNetaImponible - 35 * UIT, 10 * UIT);
      impuestoAnual5ta += tramo4 * 0.20;
    }
    if (rentaNetaImponible > 45 * UIT) {
      const tramo5 = rentaNetaImponible - 45 * UIT;
      impuestoAnual5ta += tramo5 * 0.30;
    }
  }

  const retencionMensual5ta = Math.round((impuestoAnual5ta / 12) * 100) / 100;
  const totalDescuentos = descuentoPension + retencionMensual5ta;
  const sueldoNetoFinal = Math.max(0, ingresoTotalBruto - totalDescuentos);

  // Aporte que paga el empleador a EsSalud (9%), NO se descuenta al trabajador
  const aporteEssaludEmpleador = Math.round(ingresoTotalBruto * 0.09 * 100) / 100;

  const formatMoney = (val: number) =>
    `S/ ${val.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const shareText = encodeURIComponent(
    `💼 *Cálculo de Sueldo Neto en Perú*\n💵 Sueldo Bruto: ${formatMoney(ingresoTotalBruto)}\n🔻 Descuento Pensión (${nombrePension}): ${formatMoney(descuentoPension)}\n🔻 Retención 5ta Categoría: ${formatMoney(retencionMensual5ta)}\n\n👉 *NETO EN MANO: ${formatMoney(sueldoNetoFinal)}*\n\nCalcula tu sueldo en: https://consultasperu.safezoneperu.com/calculadora-sueldo-neto/`
  );

  return (
    <div className="bg-white rounded-xl shadow-clean border border-ink-100 p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-ink-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-200">
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-heading text-lg sm:text-xl font-bold text-ink-950">
              Calculadora de Sueldo Neto (Líquido en Mano)
            </h2>
            <p className="text-xs text-ink-500">
              Descuentos oficiales de AFP / ONP e Impuesto a la Renta de 5ta Categoría SUNAT
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
        {/* Formulario de Entrada */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 mb-1.5">
              Sueldo Bruto Mensual (S/)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-ink-400 font-bold font-tabular">S/</span>
              <input
                type="number"
                step="50"
                min="0"
                value={sueldoBruto}
                onChange={(e) => setSueldoBruto(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-ink-200 rounded-lg text-ink-950 font-tabular font-bold focus:bg-white focus:border-carmesi-600 focus:outline-none transition-colors"
                placeholder="3000"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 mb-1.5">
              Sistema de Pensiones
            </label>
            <select
              value={sistemaPension}
              onChange={(e) => setSistemaPension(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-ink-200 rounded-lg text-sm text-ink-900 font-medium focus:bg-white focus:border-carmesi-600 focus:outline-none transition-colors cursor-pointer"
            >
              <option value="afp_integra">AFP Integra (~11.70%)</option>
              <option value="afp_prima">AFP Prima (~11.88%)</option>
              <option value="afp_profuturo">AFP Profuturo (~12.37%)</option>
              <option value="afp_habitat">AFP Habitat (~11.70%)</option>
              <option value="onp">ONP — Sistema Nacional (13.00%)</option>
            </select>
          </div>

          {sistemaPension !== 'onp' && (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 mb-1.5">
                Tipo de Comisión AFP
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setTipoComision('mixta')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-colors ${
                    tipoComision === 'mixta'
                      ? 'bg-ink-950 text-white border-ink-950'
                      : 'bg-slate-50 text-ink-700 border-ink-200 hover:bg-slate-100'
                  }`}
                >
                  Comisión Mixta (Por saldo)
                </button>
                <button
                  type="button"
                  onClick={() => setTipoComision('flujo')}
                  className={`py-2 px-3 text-xs font-semibold rounded-lg border text-center transition-colors ${
                    tipoComision === 'flujo'
                      ? 'bg-ink-950 text-white border-ink-950'
                      : 'bg-slate-50 text-ink-700 border-ink-200 hover:bg-slate-100'
                  }`}
                >
                  Comisión sobre Flujo (Sueldo)
                </button>
              </div>
            </div>
          )}

          <div className="pt-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={asignacionFamiliar}
                onChange={(e) => setAsignacionFamiliar(e.target.checked)}
                className="w-4 h-4 text-carmesi-600 rounded border-ink-300 focus:ring-carmesi-500 cursor-pointer"
              />
              <span className="text-xs font-semibold text-ink-800">
                Tengo hijos menores de edad (+ S/ 123.00 Asignación Familiar)
              </span>
            </label>
          </div>
        </div>

        {/* Resumen del Desglose */}
        <div className="bg-slate-50 rounded-xl p-5 border border-ink-100 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-500 block">
              Desglose de tu Boleta de Pago
            </span>

            <div className="flex justify-between items-center text-sm py-1.5 border-b border-ink-200/60">
              <span className="text-ink-600">Ingreso Bruto Total:</span>
              <span className="font-bold font-tabular text-ink-950">{formatMoney(ingresoTotalBruto)}</span>
            </div>

            <div className="flex justify-between items-center text-sm py-1.5 border-b border-ink-200/60 text-carmesi-700">
              <span className="flex items-center gap-1">
                Aporte {nombrePension}:
              </span>
              <span className="font-bold font-tabular">- {formatMoney(descuentoPension)}</span>
            </div>

            <div className="flex justify-between items-center text-sm py-1.5 border-b border-ink-200/60 text-amber-800">
              <span className="flex items-center gap-1">
                Retención 5ta Categoría (SUNAT):
              </span>
              <span className="font-bold font-tabular">
                {retencionMensual5ta > 0 ? `- ${formatMoney(retencionMensual5ta)}` : 'S/ 0.00 (Exonerado)'}
              </span>
            </div>

            {retencionMensual5ta === 0 && (
              <p className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded border border-emerald-200">
                ✓ No te descuentan 5ta categoría porque tus ingresos anuales no superan las 7 UIT (S/ 37,450).
              </p>
            )}

            <div className="pt-2">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-800 block">
                    Sueldo Neto a Cobrar
                  </span>
                  <span className="text-[11px] text-emerald-600 font-medium">Monto que ingresa a tu cuenta bancaria</span>
                </div>
                <div className="font-tabular text-2xl sm:text-3xl font-black text-emerald-800">
                  {formatMoney(sueldoNetoFinal)}
                </div>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-ink-400 border-t border-ink-200/60 pt-3">
            <span>Aporte EsSalud a cargo de la empresa (9%): <strong>{formatMoney(aporteEssaludEmpleador)}</strong> (no te lo descuentan a ti).</span>
          </div>
        </div>
      </div>
    </div>
  );
}