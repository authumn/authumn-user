FROM node:alpine

ENV CLIENT_ID authumn
ENV MONGO_URL mongodb://localhost/authumn
ENV WHITELIST http://localhost,http://test.com
ENV JWT_SECRET change_me
ENV REDIS_HOST localhost
ENV REDIS_PORT 6379
ENV REDIS_DATABASE 1

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
