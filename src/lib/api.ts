/**
 * Cliente de conexión con el backend de Consulta Hoy Perú (docs/03-api-v1.md)
 */

const API_BASE = import.meta.env.PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface ApiResponse<T> {
  data: T;
  meta?: {
    actualizado_en?: string;
    fuente?: string;
    stale?: boolean;
    referencial?: boolean;
    total?: number;
    [key: string]: any;
  };
}

export interface ApiError {
  error: {
    codigo: string;
    mensaje: string;
    detalles?: Record<string, string[]>;
  };
}

export interface DolarData {
  moneda: string;
  compra: number;
  venta: number;
  fecha: string;
}

export interface SismoData {
  id: number;
  id_externo: string;
  magnitud: number;
  lugar: string;
  fecha_hora: string;
  latitud: number;
  longitud: number;
  profundidad_km: number;
  referencia_url?: string;
}

export interface FeriadoData {
  id: number;
  fecha: string;
  nombre: string;
  tipo: string;
  irrenunciable: boolean;
}

export interface ProximoFeriadoData {
  fecha: string;
  nombre: string;
  tipo: string;
  dias_faltantes: number;
}

export interface RucData {
  ruc: string;
  razon_social: string;
  estado: string;
  condicion: string;
  direccion: string | null;
  departamento: string | null;
  provincia: string | null;
  distrito: string | null;
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json?.error?.mensaje || `Error de API HTTP ${response.status}`);
  }

  return json;
}

export const api = {
  // Dólar
  getDolarActual: () => fetchApi<DolarData>('/dolar'),
  convertirMoneda: (de: string, a: string, monto: number) =>
    fetchApi<{ de: string; a: string; monto: number; resultado: number; tasa: number }>(
      `/monedas/convertir?de=${de}&a=${a}&monto=${monto}`
    ),

  // Sismos
  getSismos: (limite = 10, minMagnitud = 3.0) =>
    fetchApi<SismoData[]>(`/sismos?limite=${limite}&min_magnitud=${minMagnitud}`),

  // Feriados
  getFeriados: (anio?: number) => fetchApi<FeriadoData[]>(`/feriados${anio ? `?anio=${anio}` : ''}`),
  getProximoFeriado: () => fetchApi<ProximoFeriadoData>('/feriados/proximo'),

  // Calculadoras
  calcularIgv: (monto: number, tipo: 'base' | 'total') =>
    fetchApi<{ base: number; igv: number; total: number; tasa: number }>('/calculadoras/igv', {
      method: 'POST',
      body: JSON.stringify({ monto, tipo }),
    }),

  calcularGratificacion: (params: {
    sueldo: number;
    asignacion_familiar: boolean;
    meses_trabajados: number;
    promedio_variables?: number;
    tipo_seguro: 'essalud' | 'eps';
  }) =>
    fetchApi<{
      remuneracion_computable: number;
      gratificacion: number;
      bonificacion_extraordinaria: number;
      total: number;
    }>('/calculadoras/gratificacion', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  calcularCts: (params: {
    sueldo: number;
    asignacion_familiar: boolean;
    ultima_gratificacion: number;
    meses: number;
    dias?: number;
  }) =>
    fetchApi<{
      remuneracion_computable: number;
      cts_por_meses: number;
      cts_por_dias: number;
      total: number;
    }>('/calculadoras/cts', {
      method: 'POST',
      body: JSON.stringify(params),
    }),

  // RUC
  consultarRuc: (ruc: string) => fetchApi<RucData>(`/ruc/${ruc}`),

  // DNI
  validarDni: (dni: string) =>
    fetchApi<{ dni: string; valido: boolean; formato: string }>('/dni/validar', {
      method: 'POST',
      body: JSON.stringify({ dni }),
    }),
};
