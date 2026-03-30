FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx ng build --configuration production

FROM nginx:alpine AS serve

RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/creativehub-fe/browser/ /usr/share/nginx/html/

RUN printf "server {\n    listen 80;\n    server_name _;\n\n    root /usr/share/nginx/html;\n    index index.html;\n\n    location / {\n        try_files \$uri \$uri/ /index.html;\n    }\n}\n" > /etc/nginx/conf.d/default.conf

EXPOSE 80
