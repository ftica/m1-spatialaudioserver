FROM alpine:3.15.0 as ffmpeg-build

ARG FFMPEG_VER=4.4
ARG MAKEFLAGS="-j4"

ENV TZ=america/new_york

WORKDIR /tmp/ffmpeg-${FFMPEG_VER}

# get ffmpeg source
RUN wget -qO- https://ffmpeg.org/releases/ffmpeg-${FFMPEG_VER}.tar.gz | tar zxf - -C /tmp

# install ffmpeg build dependencies
RUN apk add --no-cache --virtual .build-deps \
    build-base \
    coreutils \
    fdk-aac-dev \
    freetype-dev \
    gcc \
    lame-dev \
    libass-dev \
    libtheora-dev \
    libvorbis-dev \
    libvpx-dev \
    opus-dev \
    openssl \
    openssl-dev \
    pkgconf \
    pkgconfig \
    rtmpdump-dev \
    wget \
    x264-dev \
    yasm && \
# build ffmpeg
    ./configure \
    --disable-debug \
    --disable-doc \
    --disable-ffplay \
    --enable-avresample \
    --enable-gpl \
    --enable-libass \
    --enable-libfdk-aac \
    --enable-libfreetype \
    --enable-libmp3lame \
    --enable-libopus \
    --enable-libtheora \
    --enable-libvorbis \
    --enable-libvpx \
    --enable-libx264 \
    --enable-nonfree \
    --enable-openssl \
    --enable-postproc \
    --enable-small \
    --enable-version3 \
    --extra-libs="-lpthread -lm" \
    --prefix=/user/local && \
    make && \
    make install && \
    make distclean && \
    apk del .build-deps && \
    rm -rf /var/cache/apk/* /tmp/*
