FROM mhart/alpine-node:8

ENV CLIENT_ID authumn
ENV SALT_ROUNDS 10
ENV MONGO_URL mongodb://localhost/authumn
ENV WHITELIST http://localhost,http://test.com

# For node bcrypt
RUN apk --no-cache add --virtual builds-deps build-base python


ADD . /app

WORKDIR /app
RUN npm install
RUN npm rebuild bcrypt --build-from-source

EXPOSE 2302

ENTRYPOINT ["npm", "start"]
