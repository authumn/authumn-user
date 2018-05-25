# Authumn User Service

[![version](https://img.shields.io/npm/v/@authumn/user-service.svg?style=flat-square)](http://npm.im/ghooks)
[![travis build](https://img.shields.io/travis/authumn/user-service.svg?style=flat-square)](https://travis-ci.org/authumn/user-service)
[![Dependencies status](https://img.shields.io/rhalff/authumn-org/user-service.svg?style=flat-square)](https://david-dm.org/authumn-org/user-service#info=dependencies)
[![Dev Dependencies status](https://img.shields.io/rhalff/dev/ghooks-org/ghooks.svg?style=flat-square)](https://david-dm.org/authumn-org/user-service#info=devDependencies)

[![MIT License](https://img.shields.io/npm/l/@authumn/user-service.svg?style=flat-square)](http://opensource.org/licenses/MIT)
[![downloads](https://img.shields.io/npm/dm/@authumn/user-service.svg?style=flat-square)](http://npm-stat.com/charts.html?package=@authumn/user-service&from=2018-04-01)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?style=flat-square)](http://commitizen.github.io/cz-cli/)

Handling of registrations and logins.

### Installation

```
$ yarn install
```

### Start

```
$ yarn start
```

### API

Post()
`http://localhost:3000/user/login`: Login with username and password

Post()
`http://localhost:3000/user/register`: Register with username, email and password 
