# syntax=docker/dockerfile:1

# Etapa 1: Compilación de la aplicación estática (Node.js Alpine)
FROM node:22-alpine AS builder

WORKDIR /app

# Variables de compilación (inyectables en Coolify)
ARG SITE_URL=https://consultasperu.safezoneperu.com
ARG PUBLIC_API_URL=https://api-consultas.safezoneperu.com/api/v1

ENV SITE_URL=$SITE_URL
ENV PUBLIC_API_URL=$PUBLIC_API_URL

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Etapa 2: Servidor web ultraligero de producción (Nginx Alpine ~25MB)
FROM nginx:alpine AS runner

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
