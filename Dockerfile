FROM node:20.11.1-alpine3.19 AS build

WORKDIR /app

COPY package.json ./

RUN yarn install

ENV PATH /app/node_modules/.bin:$PATH

COPY . .

RUN yarn run build

FROM nginx:1.25.4-alpine3.18

RUN apk add --no-cache tzdata

COPY ./nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /var/www/html/

EXPOSE 3000

ENV TZ="Europe/Berlin"

RUN cp /usr/share/zoneinfo/Europe/Berlin /etc/localtime && \
    echo "Europe/Berlin" > /etc/timezone

ENTRYPOINT ["nginx","-g","daemon off;"]