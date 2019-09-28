FROM node:alpine

ENV CLIENT_ID authumn
ENV MONGO_URI mongodb://localhost/authumn-user
ENV WHITELIST http://localhost,http://test.com
ENV JWT_SECRET change_me
ENV REDIS_HOST localhost
ENV REDIS_PORT 6379
ENV REDIS_DATABASE 1
 # Either mongo.service or gogs.service
ENV PROVIDER gogs.service
ENV GOGS_API_URL 'https://repos.chix.io/api/v1'
ENV GOGS_API_KEY ''

ENV GRPC_PORT 50051
ENV GRPC_HOST 0.0.0.0

ADD src/ /app/src
ADD package.json /app
ADD tsconfig.json /app
ADD index.js /app

WORKDIR /app

RUN apk --no-cache add --virtual native-deps \
  git g++ gcc libgcc libstdc++ linux-headers make python && \
  npm install node-gyp -g &&\
  npm install &&\
  npm rebuild bcrypt --build-from-source && \
  npm cache clean --force &&\
  apk del native-deps

USER node

EXPOSE 2302

ENTRYPOINT ["npm", "start"]
