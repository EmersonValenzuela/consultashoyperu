import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, XCircle, Search } from 'lucide-react';
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
        formato: 'DNI estándar (8 dígitos)',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-lg bg-teal-100 text-teal-600 flex items-center justify-center">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Validador de Formato DNI</h2>
          <p className="text-xs text-slate-500">Verificación inmediata de estructura de documento de identidad peruano</p>
        </div>
      </div>

      <form onSubmit={handleValidate} className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
          Número de DNI (8 dígitos)
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-3 text-slate-400">
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
              placeholder="Ej. 12345678"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 focus:bg-white text-base tracking-widest"
            />
          </div>
          <button
            type="submit"
            disabled={loading || dni.length !== 8}
            className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center shadow-sm"
          >
            Verificar Formato
          </button>
        </div>
      </form>

      {result && (
        <div
          className={`p-5 rounded-xl border flex items-center gap-4 ${
            result.valido
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border-rose-200 text-rose-900'
          }`}
        >
          {result.valido ? (
            <CheckCircle2 className="w-8 h-8 text-emerald-600 flex-shrink-0" />
          ) : (
            <XCircle className="w-8 h-8 text-rose-600 flex-shrink-0" />
          )}
          <div>
            <span className="text-base font-bold block">
              {result.valido ? 'Formato de DNI Válido' : 'Formato de DNI Inválido'}
            </span>
            <span className="text-xs text-slate-600 block mt-0.5">
              {result.valido
                ? `El documento ${result.dni} cumple con el estándar de 8 dígitos numéricos de RENIEC.`
                : `El número ${result.dni} no cumple con la estructura estándar de 8 dígitos.`}
            </span>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
        <span>Validación local inmediata</span>
        <span>Sin almacenamiento ni exposición de datos (Ley 29733)</span>
      </div>
    </div>
  );
}
