ARG LUA_JIT_VER=2.1-20220111
ARG LUA_RESTY_CORE_VER=0.1.22
ARG LUA_RESTY_CACHE_VER=0.11

FROM alpine:3.15.0 as luajit-build
ARG LUA_JIT_VER
ARG LUA_RESTY_CORE_VER
ARG LUA_RESTY_CACHE_VER
ARG MAKEFLAGS="-j4"

WORKDIR /tmp

# get sources
# luajit
RUN wget -qO- https://github.com/openresty/luajit2/archive/refs/tags/v${LUA_JIT_VER}.tar.gz | tar zxf - && \
# lua-resty-core
    wget -qO- https://github.com/openresty/lua-resty-core/archive/refs/tags/v${LUA_RESTY_CORE_VER}.tar.gz | tar zxf - && \
# lua-resty-cache
    wget -qO- https://github.com/openresty/lua-resty-lrucache/archive/refs/tags/v${LUA_RESTY_CACHE_VER}.tar.gz | tar zxf -

ARG LUA_JIT_PATH=/tmp/luajit2-${LUA_JIT_VER}
ARG LUA_RESTY_CORE_PATH=/tmp/lua-resty-core-${LUA_RESTY_CORE_VER}
ARG LUA_RESTY_CACHE_PATH=/tmp/lua-resty-lrucache-${LUA_RESTY_CACHE_VER}
ARG LUA_PREFIX_SNIP="prefix=/usr/local/luajit"

# install luajit build dependencies
RUN apk add --no-cache --virtual .build-deps \
    build-base \
    ca-certificates \
    musl-dev \
    openssl-dev \
    pcre-dev \
    pkgconfig \
    zlib-dev && \
    make ${LUA_PREFIX_SNIP} -C ${LUA_JIT_PATH} && \
    make ${LUA_PREFIX_SNIP} -C ${LUA_RESTY_CORE_PATH} && \
    make ${LUA_PREFIX_SNIP} -C ${LUA_RESTY_CACHE_PATH} && \
    make ${LUA_PREFIX_SNIP} install -C ${LUA_JIT_PATH} && \
    make ${LUA_PREFIX_SNIP} install -C ${LUA_RESTY_CORE_PATH} && \
    make ${LUA_PREFIX_SNIP} install -C ${LUA_RESTY_CACHE_PATH} && \
    apk del .build-deps && \
    rm -rf /var/cache/* /tmp/*
#    linux-headers \
#    curl \
#    pcre \
#    openssl \



# binutils file gcc g++ make libc-dev fortify-headers patch
