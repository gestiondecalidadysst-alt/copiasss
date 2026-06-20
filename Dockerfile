# Etapa 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Declarar build args para que Vite los reciba en tiempo de build
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Aumentar memoria disponible para el build
ENV NODE_OPTIONS=--max-old-space-size=4096

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .

RUN npm run build

# Etapa 2: Servir con nginx
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

# Configuración para React Router (rutas SPA)
RUN echo 'server { \
  listen 80; \
  location / { \
    root /usr/share/nginx/html; \
    index index.html; \
    try_files $uri $uri/ /index.html; \
  } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
