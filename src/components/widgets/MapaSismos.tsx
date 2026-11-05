import React, { useEffect, useRef, useState } from 'react';
import type { SismoData } from '../../lib/api';
import { MapPin, RotateCcw, ShieldCheck } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface Props {
  sismos: SismoData[];
}

export default function MapaSismos({ sismos }: Props) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [activeCount, setActiveCount] = useState<number>(0);

  useEffect(() => {
    let isMounted = true;
    let map: any = null;

    const initMap = async () => {
      if (!mapContainerRef.current) return;

      const L = await import('leaflet');

      if (!isMounted || !mapContainerRef.current) return;

      // Si ya existía una instancia previa, la destruimos
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Centro geográfico referencial de Perú
      const defaultCenter: [number, number] = [-9.19, -75.0152];
      const defaultZoom = 5;

      map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: defaultZoom,
        minZoom: 4,
        maxZoom: 12,
        scrollWheelZoom: false, // Evita zoom accidental al scrollear la página
      });

      // Añadir capa de OpenStreetMap estándar (100% libre, pública y sin API key ni marcas de agua)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;

      const validEvents = sismos.filter(
        (s) => typeof s.latitud === 'number' && typeof s.longitud === 'number' && !isNaN(s.latitud) && !isNaN(s.longitud)
      );

      setActiveCount(validEvents.length);

      const latLngBounds: [number, number][] = [];

      validEvents.forEach((sismo) => {
        const isHigh = sismo.magnitud >= 5.0;
        const isMedium = sismo.magnitud >= 4.0 && sismo.magnitud < 5.0;

        const color = isHigh ? '#e11d48' : isMedium ? '#d97706' : '#059669';
        const fillColor = isHigh ? '#f43f5e' : isMedium ? '#f59e0b' : '#10b981';
        const radius = isHigh ? 13 : isMedium ? 10 : 7;

        const rawFecha = sismo.ocurrido_en || sismo.fecha_hora;
        const fechaObj = rawFecha ? new Date(rawFecha) : null;
        const fechaLima =
          fechaObj && !isNaN(fechaObj.getTime())
            ? fechaObj.toLocaleString('es-PE', {
                timeZone: 'America/Lima',
                dateStyle: 'medium',
                timeStyle: 'short',
              })
            : 'Fecha no disponible';

        const profNum = sismo.profundidad_km ?? sismo.profundidad;
        const profStr = profNum !== null && profNum !== undefined ? `${Math.round(Number(profNum))} km` : 'No reportada';

        // Marcador circular con escala según magnitud
        const marker = L.circleMarker([sismo.latitud, sismo.longitud], {
          radius: radius,
          fillColor: fillColor,
          color: color,
          weight: 2,
          opacity: 0.95,
          fillOpacity: 0.8,
        });

        // Contenido del popup con diseño Tailwind / Clean UI
        const popupContent = `
          <div style="font-family: inherit; font-size: 13px; min-width: 200px; color: #0f172a; padding: 2px;">
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 6px; padding-bottom: 5px; border-bottom: 1px solid #e2e8f0;">
              <span style="font-weight: 800; font-size: 13px; color: ${color};">MAGNITUD ${sismo.magnitud.toFixed(1)}</span>
              <span style="font-size: 10px; font-weight: 700; background: #f1f5f9; color: #475569; padding: 2px 6px; border-radius: 4px; text-transform: uppercase;">
                ${sismo.fuente || 'USGS / IGP'}
              </span>
            </div>
            <div style="font-weight: 700; font-size: 13px; line-height: 1.3; margin-bottom: 6px; color: #0f172a;">
              ${sismo.lugar}
            </div>
            <div style="font-size: 11px; color: #64748b; line-height: 1.5; margin-bottom: 8px;">
              <div>🕒 <strong>Hora:</strong> ${fechaLima}</div>
              <div>📏 <strong>Profundidad:</strong> ${profStr}</div>
              <div>📍 <strong>Coordenadas:</strong> ${sismo.latitud.toFixed(4)}, ${sismo.longitud.toFixed(4)}</div>
            </div>
            <div style="display: flex; gap: 8px; pt-2; border-top: 1px solid #f1f5f9;">
              <a href="https://www.google.com/maps?q=${sismo.latitud},${sismo.longitud}" target="_blank" rel="noopener noreferrer" style="font-size: 11px; font-weight: 700; color: #be123c; text-decoration: none; display: inline-flex; align-items: center; gap: 3px;">
                Ver en Google Maps →
              </a>
            </div>
          </div>
        `;

        marker.bindPopup(popupContent, { maxWidth: 280 });
        marker.bindTooltip(`M ${sismo.magnitud.toFixed(1)} - ${sismo.lugar}`, {
          direction: 'top',
          offset: [0, -radius],
        });

        marker.addTo(map);
        latLngBounds.push([sismo.latitud, sismo.longitud]);
      });

      // Si hay eventos sísmicos válidos, ajustamos el mapa para encuadrarlos
      if (latLngBounds.length > 0) {
        if (latLngBounds.length === 1) {
          map.setView(latLngBounds[0], 7);
        } else {
          map.fitBounds(latLngBounds, {
            padding: [45, 45],
            maxZoom: 7,
          });
        }
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [sismos]);

  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    const validEvents = sismos.filter(
      (s) => typeof s.latitud === 'number' && typeof s.longitud === 'number' && !isNaN(s.latitud) && !isNaN(s.longitud)
    );
    if (validEvents.length > 1) {
      const bounds = validEvents.map((s) => [s.latitud, s.longitud] as [number, number]);
      mapInstanceRef.current.fitBounds(bounds, { padding: [45, 45], maxZoom: 7 });
    } else {
      mapInstanceRef.current.setView([-9.19, -75.0152], 5);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-ink-100 shadow-clean overflow-hidden">
      {/* Cabecera del Mapa */}
      <div className="px-5 py-4 border-b border-ink-100 bg-slate-50/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-heading text-sm sm:text-base font-bold text-ink-900 flex items-center gap-2">
              Mapa de Epicentros en Tiempo Real
            </h2>
            <p className="text-xs text-ink-500">
              {activeCount > 0 ? `${activeCount} eventos geolocalizados en el territorio y costa peruana` : 'Monitoreo de la red sísmica nacional'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Leyenda de magnitudes */}
          <div className="hidden sm:flex items-center gap-3 text-[11px] font-semibold text-ink-600 bg-white px-2.5 py-1.5 rounded-lg border border-ink-200 shadow-xs">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span> ≥ 5.0 Alerta
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> 4.0 - 4.9
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> &lt; 4.0
            </span>
          </div>

          <button
            type="button"
            onClick={handleResetView}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white hover:bg-slate-50 border border-ink-200 rounded-lg text-ink-700 transition-colors shadow-xs cursor-pointer"
            title="Reenfocar mapa"
          >
            <RotateCcw className="w-3.5 h-3.5 text-ink-500" />
            <span className="hidden md:inline">Centrar</span>
          </button>
        </div>
      </div>

      {/* Contenedor del Mapa interactivo */}
      <div className="relative w-full h-[360px] sm:h-[440px] bg-slate-100 z-10">
        <div ref={mapContainerRef} className="w-full h-full" />
      </div>

      {/* Footer del Mapa */}
      <div className="px-4 py-2.5 bg-slate-50 border-t border-ink-100 flex flex-wrap items-center justify-between text-[11px] text-ink-500">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          Haz clic o pulsa en cualquier punto para ver datos exactos y abrir en Google Maps.
        </span>
        <span className="font-mono text-[10px] text-ink-400">
          Cartografía: OpenStreetMap
        </span>
      </div>
    </div>
  );
}