FROM node:16 AS build

WORKDIR /dips-markdown-test

COPY . ./
RUN npm install
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY config/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /dips-markdown-test/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]