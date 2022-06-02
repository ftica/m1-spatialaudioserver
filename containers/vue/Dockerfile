FROM node:14.16-alpine3.13 as vue-build

#RUN apk add --no-cache \
#    build-base \
#    coreutils \
#    gcc \
#    git \
#    python2

WORKDIR /app

COPY ./vue-front ./source/

RUN apk add --no-cache --virtual .build-deps \
    build-base \
    coreutils \
    git \
    openssh \
    gcc \
    python2 && \
    mkdir /app/build && \
    mv /app/source/package.json /app/build && \
    cd /app/build && \
    npm install && \
    mv /app/source/* /app/build && \
    mv /app/source/.eslintrc.js /app/build/src/.eslintrc.js && \
    cd /app/build && \
    npm run build && \
    mkdir /app/runtime && \
    mv /app/build/dist/* /app/runtime && \
    rm -rf /app/build && \
    rm -rf /app/source && \
    apk del .build-deps


#COPY ./vue-front/package*.json ./
#COPY ./vue-front/lib ./lib/
#
#RUN ["npm", "install"]
#
#COPY ./vue-front .
#
#RUN apk add --no-cache --virtual .build-deps \
#    build-base \
#    coreutils \
#    gcc \
#    git \
#    python2 && \
#    npm run build && \
#    mkdir /app/runtime && \
#    mv /app/build/dist/* /app/runtime && \
#    rm -rf /app/build && \
#    apk del .build-deps
