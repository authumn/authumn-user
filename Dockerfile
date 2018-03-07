FROM mhart/alpine-node:8

ENV CLIENT_ID authumn
ENV SALT_ROUNDS 10
ENV MONGO_URL mongodb://localhost/authumn
ENV WHITELIST http://localhost,http://test.com

WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --production
COPY . .

EXPOSE 2302

ENTRYPOINT ["npm", "start"]
