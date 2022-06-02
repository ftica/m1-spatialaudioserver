FROM node:16.14-alpine3.15 as koa-runtime

WORKDIR /usr/src/app

RUN npm install pm2 typescript -g

COPY ./koa-server/package*.json ./
RUN npm ci

COPY ./koa-server .

RUN ["npm", "run", "build"]

EXPOSE 3000
CMD ["pm2-runtime", "ecosystem.config.js", "--env", "production"]
