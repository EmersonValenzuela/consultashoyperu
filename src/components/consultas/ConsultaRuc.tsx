import React, { useState } from 'react';
import { Search, Building2, MapPin, AlertCircle, Loader2 } from 'lucide-react';
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
      setError(err?.message || 'No se pudo consultar el RUC. Verifique el número ingresado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 md:p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Consulta RUC SUNAT</h2>
          <p className="text-xs text-slate-500">Valida la razón social, estado tributario y condición de domicilio fiscal</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mb-6">
        <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
          Número de RUC (11 dígitos)
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3.5 top-3 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              maxLength={11}
              value={ruc}
              onChange={(e) => setRuc(e.target.value.replace(/\D/g, ''))}
              placeholder="Ej. 20100070970"
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 font-mono font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white text-base tracking-wider"
            />
          </div>
          <button
            type="submit"
            disabled={loading || ruc.length !== 11}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-semibold px-6 py-2.5 rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Consultando...
              </>
            ) : (
              'Consultar'
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700 text-sm mb-6">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block">Consulta no exitosa</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {data && (
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200 space-y-4 animate-in fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs text-slate-500 font-mono">RUC: {data.ruc}</span>
              <h3 className="text-lg font-bold text-slate-900 leading-tight">{data.razon_social}</h3>
            </div>
            <div className="flex gap-2">
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  data.estado === 'ACTIVO'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {data.estado}
              </span>
              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                  data.condicion === 'HABIDO'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-rose-100 text-rose-800'
                }`}
              >
                {data.condicion}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700">
            {data.direccion && (
              <div className="sm:col-span-2 flex items-start gap-2">
                <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" />
                <div>
                  <span className="text-xs text-slate-400 block">Dirección Fiscal</span>
                  <span className="font-medium">{data.direccion}</span>
                </div>
              </div>
            )}
            <div>
              <span className="text-xs text-slate-400 block">Ubicación</span>
              <span className="font-medium">
                {[data.distrito, data.provincia, data.departamento].filter(Boolean).join(' - ') || 'No especificada'}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Condición SUNAT</span>
              <span className="font-medium">{data.condicion}</span>
            </div>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400">
        <span>Fuente: Padrón de Contribuyentes SUNAT</span>
        <span>Validación matemática Módulo 11</span>
      </div>
    </div>
  );
}
