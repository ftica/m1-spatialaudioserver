FROM alpine:3.15.0 as nginx-build

ARG NGINX_VER=1.21.6
ARG NGINX_RTMP_VER=1.2.2
ARG NGINX_DEV_KIT_VER=0.3.1
ARG NGINX_VOD_VER=1.28
ARG LUA_NGINGX_MODULE_VER=0.10.19
ARG LUA_JIT_VER=2.1-20210510
ARG LUA_RESTY_CORE_VER=0.1.21
ARG LUA_RESTY_CACHE_VER=0.10
ARG MAKEFLAGS="-j4"

# install dependencies
RUN apk add --no-cache \
  build-base \
  ca-certificates \
  curl \
  gcc \
  libc-dev \
  libgcc \
  linux-headers \
  make \
  musl-dev \
  openssl \
  openssl-dev \
  pcre \
  pcre-dev \
  pkgconf \
  pkgconfig \
  zlib-dev

WORKDIR /tmp

# get sources
    # nginx
RUN wget -qO- https://nginx.org/download/nginx-${NGINX_VER}.tar.gz | tar zxf - && \
    # nginx-rtmp-module
    wget -qO- https://github.com/arut/nginx-rtmp-module/archive/v${NGINX_RTMP_VER}.tar.gz | tar zxf - && \
    # nginx-vod-module
    wget -qO- https://github.com/kaltura/nginx-vod-module/archive/${NGINX_VOD_VER}.tar.gz | tar zxf - && \
    # nginx-devel-kit
    wget -qO- https://github.com/vision5/ngx_devel_kit/archive/refs/tags/v${NGINX_DEV_KIT_VER}.tar.gz | tar zxf - && \
    # luajit
    wget -qO- https://github.com/openresty/luajit2/archive/refs/tags/v${LUA_JIT_VER}.tar.gz | tar zxf - && \
    # lua-nginx-module
    wget -qO- https://github.com/openresty/lua-nginx-module/archive/refs/tags/v${LUA_NGINGX_MODULE_VER}.tar.gz | tar zxf - && \
    # lua-resty-core
    wget -qO- https://github.com/openresty/lua-resty-core/archive/refs/tags/v${LUA_RESTY_CORE_VER}.tar.gz | tar zxf - && \
    # lua-resty-cache
    wget -qO- https://github.com/openresty/lua-resty-lrucache/archive/refs/tags/v${LUA_RESTY_CACHE_VER}.tar.gz | tar zxf -

# build luajit
RUN make -C ./luajit2-${LUA_JIT_VER} prefix=/usr/local/luajit && \
    make install -C ./luajit2-${LUA_JIT_VER} prefix=/usr/local/luajit && \
    make -C ./lua-resty-core-${LUA_RESTY_CORE_VER} prefix=/usr/local/luajit && \
    make install -C ./lua-resty-core-${LUA_RESTY_CORE_VER} prefix=/usr/local/luajit && \
    make -C ./lua-resty-lrucache-${LUA_RESTY_CACHE_VER} prefix=/usr/local/luajit && \
    make install -C ./lua-resty-lrucache-${LUA_RESTY_CACHE_VER} prefix=/usr/local/luajit

# compile nginx with rtmp module
WORKDIR /tmp/nginx-${NGINX_VER}

ARG LUAJIT_LIB=/usr/local/luajit/lib
ARG LUAJIT_INC=/usr/local/luajit/include/luajit-2.1

RUN ./configure \
    --with-threads \
    --with-file-aio \
    --with-http_ssl_module \
    --with-debug \
    --add-module=/tmp/nginx-rtmp-module-${NGINX_RTMP_VER} \
    --add-module=/tmp/nginx-vod-module-${NGINX_VOD_VER} \
    --add-module=/tmp/ngx_devel_kit-${NGINX_DEV_KIT_VER} \
    --add-module=/tmp/lua-nginx-module-${LUA_NGINGX_MODULE_VER} \
    --conf-path=/etc/nginx/nginx.conf \
    --with-cc-opt="-Wimplicit-fallthrough=0" \
    --prefix=/usr/local/nginx && \
    make && \
    make install

# cleanup
RUN rm -rf /tmp/*
