FROM nginx:alpine   

WORKDIR /usr/share/nginx/html

EXPOSE 80

RUN rm -rf ./*  

COPY ./playwright-report/  /usr/share/nginx/html
