import React, { useState } from 'react';
import { Search, Building2, MapPin, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';
import { api, type RucData } from '../../lib/api';

export default function ConsultaRuc() {
  const [ruc, setRuc] = useState<string>('');
  const [data, setData] = useState<RucData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRuc = ruc.trim();

    if (!cleanRuc || cleanRuc.length !== 11) {
      setError('El RUC debe tener exactamente 11 dígitos numéricos.');
      setData(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await api.consultarRuc(cleanRuc);
      setData(res.data);
    } catch (err: any) {
      setData(null);
      setError(err?.message || 'No se pudo consultar el RUC. Verifique el número ingresado o intente más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-clean border border-ink-100 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-ink-100">
        <div className="w-10 h-10 rounded-lg bg-carmesi-50 text-carmesi-700 flex items-center justify-center border border-carmesi-200">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="font-heading text-lg sm:text-xl font-bold text-ink-950">Consulta RUC SUNAT</h2>
          <p className="text-xs text-ink-500">Valida la razón social, estado tributario y condición de domicilio fiscal</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-ink-600 mb-2">
          Número de RUC (11 dígitos)
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-3 text-ink-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              maxLength={11}
              value={ruc}
              onChange={(e) => setRuc(e.target.value.replace(/\D/g, ''))}
              placeholder="Ej. 20100070970"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50/70 border border-ink-200 rounded-lg text-ink-950 font-bold font-tabular focus:outline-none focus:ring-2 focus:ring-carmesi-600 focus:bg-white text-base tracking-wider transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading || ruc.length !== 11}
            className="bg-carmesi-700 hover:bg-carmesi-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-sm font-heading"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Verificando...
              </>
            ) : (
              'Buscar RUC'
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-3 text-rose-800 text-sm mb-6">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
          <div>
            <span className="font-bold block">No se completó la consulta</span>
            <span className="text-xs text-rose-700">{error}</span>
          </div>
        </div>
      )}

      {data && (
        <div className="bg-slate-50/90 rounded-xl p-6 border border-ink-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-ink-200">
            <div>
              <span className="text-xs text-ink-500 font-tabular font-medium">RUC: {data.ruc}</span>
              <h3 className="font-heading text-lg font-bold text-ink-950 leading-tight mt-0.5">{data.razon_social}</h3>
            </div>
            <div className="flex gap-2">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  data.estado === 'ACTIVO'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                }`}
              >
                {data.estado}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  data.condicion === 'HABIDO'
                    ? 'bg-blue-50 text-blue-800 border border-blue-200'
                    : 'bg-rose-50 text-rose-800 border border-rose-200'
                }`}
              >
                {data.condicion}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm text-ink-700">
            {data.direccion && (
              <div className="sm:col-span-2 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-carmesi-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-xs text-ink-400 block font-medium">Dirección Fiscal Declarada</span>
                  <span className="font-medium text-ink-900">{data.direccion}</span>
                </div>
              </div>
            )}
            <div>
              <span className="text-xs text-ink-400 block font-medium">Ubicación Geográfica</span>
              <span className="font-medium text-ink-900">
                {[data.distrito, data.provincia, data.departamento].filter(Boolean).join(' - ') || 'No especificada'}
              </span>
            </div>
            <div>
              <span className="text-xs text-ink-400 block font-medium">Condición de Domicilio</span>
              <span className="font-medium text-ink-900">{data.condicion}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-xs text-ink-400">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Padrón Nacional SUNAT
        </span>
        <span className="font-tabular text-[11px]">Validación Módulo 11</span>
      </div>
    </div>
  );
}
