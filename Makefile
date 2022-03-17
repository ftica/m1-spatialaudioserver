#s3_bucket_name =
#s3_stage_bucket_name =
#
# getting OS type
ifeq ($(OS),Windows_NT)
	SHELL=pwsh
	detected_OS := Windows
else
	detected_OS := $(shell uname)
endif
#
clean:
ifeq ($(OS),Windows_NT)
	del /s .\vue-front\node_modules .\vue-front\dist .\koa-server\node_modules .\koa-server\build
else
	rm -rf ./vue-front/node_modules ./vue-front/dist ./koa-server/node_modules ./koa-server/build
endif
clear: clean

stop:
	@echo Stopped
#ifneq ($(shell docker ps -q --filter name="m1*"),)
#	docker container stop $(shell docker ps -q --filter name="m1*")
#endif

remove-db-volume:
	docker volume rm m1-spatial-postgres-vol

create-db-volume: remove-db-volume
	docker volume create m1-spatial-postgres-vol

remove-db-network:
	docker network rm m1-spatial-postgres-net

create-db-network: remove-db-network
	docker network create m1-spatial-postgres-net

remove-service-network:
	docker network rm m1-spatial-service-net

create-service-network: remove-service-network
	docker network create m1-spatial-service-net

build-postgres:
	docker buildx bake -t mach1-spatial/m1-postgres:latest . -f ./docker-compose.yml database --no-cache

build-api:
	docker buildx bake -f ./docker-compose.yml api --no-cache

run-api: create-db-volume create-db-network create-service-network
	docker compose up api

build-ffmpeg:
	docker buildx build -t mach1-spatial/m1-ffmpeg:4.4-build . -f ./containers/ffmpeg/Dockerfile --no-cache

build-nginx:
	docker buildx build -t mach1-spatial/m1-nginx:1.21.6-build . -f ./containers/nginx/Dockerfile --no-cache

build-vue:
	docker buildx build -t mach1-spatial/m1-vue:dev-build . -f ./containers/vue/Dockerfile --no-cache

build-web: build-ffmpeg build-nginx build-vue
	docker buildx build -t mach1-spatial/m1-spatial-web:dev . -f ./containers/frontend/Dockerfile --no-cache

run-web: build-web
	docker run -d mach1-spatial/m1-spatial-web:dev -p 1935:1935 -p 8080:80 -p 443:443

# docker run -it -p 1935:1935 -p 8080:80 -p 443:443 mach1.tech/runtime/m1-spatial-web:dev --mount type=bind,source="C:\\Users\\Fedja\\Webstor
  #mProjects\\m1-spatialaudioserver\\koa-server\\public",target=/share/sound --name m1-spatial-web --rm m1-spatial-web

#
#stop:
#ifeq ($(shell docker ps -q --filter name="m1*"),)
#	# No m1 containers found.
#else
#	docker container stop $(shell docker ps -q --filter name="m1*")
#endif
#
#setup:
#	cd koa-server && npm i
#	cd vue-front && npm i
#
## docker network create m1-network &> /dev/null
#build: stop
#	docker build -f ./containers/koa/Dockerfile -t m1-api .
#	docker build -f ./containers/nginx/Dockerfile -t m1-transcode .
#	docker build -f ./containers/redis/Dockerfile -t m1-redis .
#
#deploy: build
#	# deploys build to public AWS bucket
#	# NOTE: relies on `mach1` keys in `~/.aws/credentials`
#
#stage: build
#	# deploys build to public staging AWS bucket
#	# NOTE: relies on `mach1` keys in `~/.aws/credentials`
#
#local: build
#	make -i -k stop
#	make run_redis_docker
#	make run_node_docker
#	make run_nginx_docker
#
#run_node_docker:
#	docker run -it -d --net m1-network --name m1-api --rm m1-api
#run_redis_docker:
#	docker run -it -d -p 6379:6379 --net m1-network --name m1-redis --rm m1-redis
#run_nginx_docker:
#	docker run -it -p 1935:1935 -p 8080:80 \
#		--net m1-network \
#		 --mount type=bind,source="$(shell pwd)/koa-server/public",target=/share/sound \
#		 --name m1-transcode \
#		 --rm m1-transcode
#
#development: stop
#	io.elementary.terminal --new-tab --working-directory="$(shell pwd)" --execute="make run_redis_docker"
#	io.elementary.terminal --new-tab --working-directory="$(shell pwd)" --execute="make run_nginx_docker"
#	io.elementary.terminal --new-tab --working-directory="$(shell pwd)" --execute="make run_node_docker"
#	io.elementary.terminal --new-tab --working-directory="$(shell pwd)/vue-front"
