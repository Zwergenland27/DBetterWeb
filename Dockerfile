# Schritt 1: Bauen
FROM node:22.19.0 AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Baue beide Sprachversionen
RUN npm run build

# Schritt 2: Nginx für Auslieferung
FROM nginx:alpine

# Kopiere Nginx-Konfiguration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Kopiere gebaute Apps
COPY --from=build /app/dist/dbetter-web/browser /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
