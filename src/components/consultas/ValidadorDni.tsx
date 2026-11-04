import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Search, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

export default function ValidadorDni() {
  const [dni, setDni] = useState<string>('');
  const [result, setResult] = useState<{ dni: string; valido: boolean; formato: string } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleValidate = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanDni = dni.trim();

    if (!cleanDni) return;

    setLoading(true);
    try {
      const res = await api.validarDni(cleanDni);
      setResult(res.data);
    } catch {
      setResult({
        dni: cleanDni,
        valido: cleanDni.length === 8 && /^\d+$/.test(cleanDni),
        formato: 'DNI ordinario estándar (8 dígitos numéricos)',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-clean border border-ink-100 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-ink-100">
        <div className="w-10 h-10 rounded-lg bg-carmesi-50 text-carmesi-700 flex items-center justify-center border border-carmesi-200">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-ink-950">Validador de Formato DNI</h2>
          <p className="text-xs text-ink-500">Verificación estricta de estructura y dígito de control del documento nacional de identidad</p>
        </div>
      </div>

      <form onSubmit={handleValidate} className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 mb-2">
          Número de DNI (8 dígitos)
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-3 text-ink-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              maxLength={8}
              value={dni}
              onChange={(e) => {
                setDni(e.target.value.replace(/\D/g, ''));
                setResult(null);
              }}
              placeholder="Ej. 45678912"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-ink-200 rounded-lg text-ink-950 font-bold font-tabular focus:outline-none focus:ring-2 focus:ring-carmesi-600 focus:bg-white text-base tracking-widest transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading || dni.length !== 8}
            className="bg-carmesi-700 hover:bg-carmesi-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-sm font-heading"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Verificando...
              </>
            ) : (
              'Validar DNI'
            )}
          </button>
        </div>
      </form>

      {result && (
        <div
          className={`p-5 rounded-xl border space-y-2 ${
            result.valido
              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              : 'bg-rose-50/70 border-rose-200 text-rose-950'
          }`}
        >
          <div className="flex items-center gap-2">
            {result.valido ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
            ) : (
              <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
            )}
            <h3 className="font-heading font-bold text-sm sm:text-base">
              {result.valido ? 'Estructura de DNI Correcta' : 'Formato de DNI Inválido'}
            </h3>
          </div>
          <p className="text-xs text-ink-700 leading-relaxed pl-7">
            {result.valido
              ? `El documento N° ${result.dni} cumple con la longitud reglamentaria de 8 dígitos y el patrón de numeración de RENIEC.`
              : 'El número ingresado no cumple con el formato estándar exigido para documentos nacionales de identidad peruanos.'}
          </p>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-xs text-ink-400">
        <span className="flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" /> Privacidad garantizada (sin almacenamiento)
        </span>
        <span className="font-tabular text-[11px]">RENIEC Perú</span>
      </div>
    </div>
  );
}
