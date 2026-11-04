# Consultahoy Web (Frontend de Consulta Hoy Perú)

Portal web de utilidades e información diaria para Perú, desarrollado con **Astro 5 + React + Tailwind CSS**.
Diseñado para máximo rendimiento (Core Web Vitals), optimización en motores de búsqueda (SEO) y monetización con anuncios publicitarios.

## 🚀 Tecnologías

- **Astro 5**: Generación estática (SSG) de alta velocidad.
- **React 19**: Componentes interactivos e hidratación selectiva (`client:load`).
- **Tailwind CSS**: Diseño responsivo y moderno.
- **Lucide React**: Iconografía.
- **TypeScript**: Tipado seguro conectado a la API de Laravel.

## 📄 Páginas y Utilidades

- `/`: Portada con resumen diario en tiempo real (Dólar, próximo feriado y último sismo).
- `/tipo-de-cambio-dolar`: Cotización de compra/venta y conversor interactivo bidireccional.
- `/sismos-peru`: Registro de los últimos 20 sismos en Perú con magnitud, profundidad y epicentro.
- `/feriados-peru`: Calendario oficial de feriados 2026 y cuenta regresiva.
- `/calculadora-igv`: Calculadora de IGV (18%) con desglose de subtotal y total.
- `/calculadora-gratificacion`: Calculadora laboral conforme a Ley 27735 y Ley 30334 (EsSalud/EPS).
- `/calculadora-cts`: Calculadora de compensación por tiempo de servicios semestral.
- `/consulta-ruc`: Buscador de RUC en SUNAT con razón social, estado y condición de domicilio.
- `/validador-dni`: Comprobación local de estructura de 8 dígitos de DNI.

## 🛠️ Comandos de Desarrollo

```bash
# Iniciar servidor de desarrollo en http://localhost:3000
npm run dev

# Compilar para producción (carpeta dist/)
npm run build

# Previsualizar el build de producción
npm run preview
```
