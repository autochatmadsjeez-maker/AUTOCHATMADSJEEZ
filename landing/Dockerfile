FROM nginx:alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY index.html robots.txt sitemap.xml /usr/share/nginx/html/
COPY brand/ /usr/share/nginx/html/brand/
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=3s CMD wget -qO- http://localhost/healthz || exit 1
