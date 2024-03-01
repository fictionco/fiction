FROM nginx
COPY ./fly/nginx.conf /etc/nginx/conf.d/nginx.conf
COPY ./fly/nginx.404.html /var/www/html/404.html
COPY ./fly/nginx.502.html /var/www/html/502.html
