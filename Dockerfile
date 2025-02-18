FROM nginx:alpine

# Copia la configuración personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos de Angular
COPY dist/ovfilm-landing/browser /usr/share/nginx/html

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
