/**
 * Cliente de conexión con el backend de Consulta Hoy Perú (docs/03-api-v1.md)
 */

const configuredApiBase = import.meta.env.PUBLIC_API_URL;

if (import.meta.env.PROD && !configuredApiBase) {
  throw new Error(
    "PUBLIC_API_URL debe configurarse para compilar el frontend de producción.",
  );
}

const API_BASE = configuredApiBase || "http://localhost:8000/api/v1";

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
  id: number | string;
  id_externo?: string;
  magnitud: number;
  lugar: string;
  ocurrido_en: string;
  fecha_hora?: string;
  latitud: number;
  longitud: number;
  profundidad_km: number | null;
  profundidad?: number | null;
  fuente?: string;
  url?: string | null;
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

export interface CombustibleData {
  id: number;
  region: string;
  tipo: string;
  nombre: string;
  octanaje: string | null;
  unidad: string;
  simbolo_unidad: string;
  precio_promedio: number;
  precio_minimo: number;
  precio_maximo: number;
  fuente: string;
  vigencia_desde: string;
}

export interface CalcularTanqueResult {
  tipo: string;
  nombre: string;
  unidad: string;
  simbolo_unidad: string;
  tipo_calculo: string;
  cantidad_tanque?: number;
  costo_promedio?: number;
  costo_minimo?: number;
  costo_maximo?: number;
  ahorro_potencial?: number;
  presupuesto_soles?: number;
  volumen_promedio?: number;
  volumen_minimo?: number;
  volumen_maximo?: number;
  volumen_extra?: number;
  precio_unitario_promedio: number;
  precio_unitario_minimo: number;
  precio_unitario_maximo: number;
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const json = isJson ? await response.json().catch(() => null) : null;

  if (!response.ok) {
    throw new Error(
      json?.error?.mensaje || `Error de API HTTP ${response.status}`,
    );
  }

  if (!json) {
    throw new Error('Respuesta inválida del servidor (se esperaba JSON).');
  }

  return json;
}

export const api = {
  // Dólar
  getDolarActual: () => fetchApi<DolarData>("/dolar"),
  getDolarHistorico: (desde: string, hasta: string) =>
    fetchApi<Array<{ fecha: string; compra: number; venta: number }>>(
      `/dolar/historico?desde=${desde}&hasta=${hasta}`,
    ),
  convertirMoneda: (de: string, a: string, monto: number) =>
    fetchApi<{
      de: string;
      a: string;
      monto: number;
      resultado: number;
      tasa: number;
    }>(`/monedas/convertir?de=${de}&a=${a}&monto=${monto}`),

  // Sismos
  getSismos: (limite = 10, minMagnitud = 3.0) =>
    fetchApi<SismoData[]>(
      `/sismos?limite=${limite}&min_magnitud=${minMagnitud}`,
    ),

  // Feriados
  getFeriados: (anio?: number) =>
    fetchApi<FeriadoData[]>(`/feriados${anio ? `?anio=${anio}` : ""}`),
  getProximoFeriado: () => fetchApi<ProximoFeriadoData>("/feriados/proximo"),

  // Calculadoras
  calcularIgv: (monto: number, tipo: "base" | "total") =>
    fetchApi<{ base: number; igv: number; total: number; tasa: number }>(
      "/calculadoras/igv",
      {
        method: "POST",
        body: JSON.stringify({ monto, tipo }),
      },
    ),

  calcularGratificacion: (params: {
    sueldo: number;
    asignacion_familiar: boolean;
    meses_trabajados: number;
    promedio_variables?: number;
    tipo_seguro: "essalud" | "eps";
  }) =>
    fetchApi<{
      remuneracion_computable: number;
      gratificacion: number;
      bonificacion_extraordinaria: number;
      total: number;
    }>("/calculadoras/gratificacion", {
      method: "POST",
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
    }>("/calculadoras/cts", {
      method: "POST",
      body: JSON.stringify(params),
    }),

  // RUC
  consultarRuc: (ruc: string) => fetchApi<RucData>(`/ruc/${ruc}`),

  // DNI
  validarDni: (dni: string) =>
    fetchApi<{ dni: string; valido: boolean; formato: string }>(
      "/dni/validar",
      {
        method: "POST",
        body: JSON.stringify({ dni }),
      },
    ),

  // Combustibles
  getCombustibles: (region?: string) =>
    fetchApi<CombustibleData[]>(
      `/combustibles${region ? `?region=${encodeURIComponent(region)}` : ""}`,
    ),

  calcularTanque: (params: {
    tipo: string;
    cantidad: number;
    tipo_calculo?: "llenar_tanque" | "presupuesto_soles";
  }) =>
    fetchApi<CalcularTanqueResult>("/combustibles/calcular-tanque", {
      method: "POST",
      body: JSON.stringify(params),
    }),
};
