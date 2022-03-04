FROM mach1-spatial/m1-nginx:1.21.6-build as nginx
FROM mach1-spatial/m1-ffmpeg:4.4-build as ffmpeg
FROM mach1-spatial/m1-vue:dev-build as vue

FROM alpine:3.15.0 as runtime

LABEL maintainer="Mach1 <whatsup@mach1.tech>"

ENV HTTP_PORT=80 \
    HTTPS_PORT=443 \
    RTMP_PORT=1935

RUN apk add --no-cache \
    build-base \
    ca-certificates \
    fdk-aac \
    gettext \
    lame \
    libass \
    libtheora \
    libvorbis \
    libvpx \
    openssl \
    opus \
    pcre \
    rtmpdump \
    x264 \
    zlib

RUN adduser \
    --system \
    --no-create-home \
    --shell /bin/false \
    --disabled-password \
    nginx

# copy build artifacts
COPY --from=nginx --chown=nginx /usr/local/luajit /usr/local/luajit
COPY --from=nginx --chown=nginx /usr/local/nginx /usr/local/nginx
COPY --from=nginx --chown=nginx /etc/nginx /etc/nginx
COPY --from=ffmpeg --chown=nginx /usr/local /usr/local
COPY --from=vue --chown=nginx /app/runtime /www

VOLUME /share/sound

COPY ./containers/frontend/nginx.conf /etc/nginx/nginx.conf.template

RUN mkdir -p /opt/data && \
    mkdir -p -m 777 /opt/data/dash && \
    chown nginx /opt/data/dash && \
    touch /opt/data/dash/play.mpd && \
    mkdir -p /share/sound && \
    chmod -R 777 /share/sound && \
    envsubst "$(env | sed -e 's/=.*//' -e 's/^/\$/g')" < \
    /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf

ENV PATH=/usr/local/nginx/sbin:$PATH \
    LD_LIBRARY_PATH=/usr/local/luajit/lib:$LD_LIBRARY_PATH

EXPOSE $RTMP_PORT $HTTP_PORT $HTTPS_PORT

CMD nginx
