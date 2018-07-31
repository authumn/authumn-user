# Authumn User Service

Handling of registrations and logins.

This service is meant to be run behind the [Authumn Gateway](https://gitlab.com/authumn/authumn-gateway).

And solely used to handle logins and registrations.

### Installation

```
$ npm i
```

### Start

```
$ npm start
```

### Docker

The following environment variables can be configured:

|Name|Type|Description|Default|
|---|---|---|---|
|`CLIENT_ID`|String|Client id|`authumn`|
|`MONGO_URL`|String|Mongo Databse Connection Url|`mongodb://localhost/authumn`|
|`WHITE_LIST`|String|Cors whitelist|`http://localhost,http://test.com`|
|`JWT_SECRET`|String|JWT Secret to sign the tokens|`change_me`|
|`REDIS_HOST`|String|Redis host of the token server|`localhost`|
|`REDIS_PORT`|String|Redis port of the token server|`localhost`|
|`REDIS_DATABASE`|String|Redis database of the token server|`localhost`|

### API

Post()
`http://localhost:3000/user/login`: Login with username and password

Post()
`http://localhost:3000/user/register`: Register with username, email and password
