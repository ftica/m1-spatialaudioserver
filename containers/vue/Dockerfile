FROM node:14.16-alpine3.13 as vue-build

#RUN apk add --no-cache \
#    build-base \
#    coreutils \
#    gcc \
#    git \
#    python2

WORKDIR /app/build
COPY ./vue-front/package*.json ./

RUN ["npm", "install"]

COPY ./vue-front .

RUN apk add --no-cache --virtual .build-deps \
    build-base \
    coreutils \
    gcc \
    git \
    python2 && \
    npm run build && \
    mkdir /app/runtime && \
    mv /app/build/dist/* /app/runtime && \
    rm -rf /app/build && \
    apk del .build-deps
