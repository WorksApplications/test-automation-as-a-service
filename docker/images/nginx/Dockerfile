FROM nginx:1.13.7

RUN rm -rf /etc/nginx/conf.d/*
COPY ./conf.d /etc/nginx/conf.d
COPY ./ngx_http_websockify_module.so /etc/nginx/modules
RUN chmod a+w /etc/nginx/conf.d/*
RUN sed -i '2 a load_module modules/ngx_http_websockify_module.so;' /etc/nginx/nginx.conf
COPY ./portal /usr/share/nginx/portal

EXPOSE 80 443
