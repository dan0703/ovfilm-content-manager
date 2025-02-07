# Etapa de construcción
FROM node:lts-bullseye AS build

WORKDIR /app
COPY . .

# Instalar dependencias y compilar Angular SSR
RUN npm ci
RUN npm run build

# Etapa de producción
FROM node:lts-bullseye AS production

WORKDIR /app

# Copiar solo las dependencias necesarias para producción
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copiar los archivos de la etapa de build
COPY --from=build /app/dist/ovfilm-landing/browser /app/browser
COPY --from=build /app/dist/ovfilm-landing/server /app/server

# Exponer el puerto del servidor SSR
EXPOSE 4200

# Ejecutar el servidor Angular SSR
CMD ["node", "server/server.mjs"]
