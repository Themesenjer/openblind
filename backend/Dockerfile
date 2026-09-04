# Backend Dockerfile - OpenBlind Node.js API
FROM node:20-alpine AS base

WORKDIR /app

# Copiar manifiestos de dependencias
COPY package.json package-lock.json ./

# Instalar dependencias de producción
RUN npm ci --only=production

# Copiar el código fuente
COPY src ./src

# Exponer el puerto del Backend (3000)
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# Comando para iniciar la API
CMD ["node", "src/index.js"]
