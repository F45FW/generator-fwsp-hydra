# <%= name %>-service

<%= purpose %>

## Pre-installation

It's recommended that [NVM](https://github.com/creationix/nvm) be used to manage NodeJS versions.
The project includes an .nvmrc which specifies NodeJS 6.2.1

## Installation

```javascript
$ nvm use
<%_ if (!npm) {_%>
$ npm install
<%_}_%>
```

## Trial

```shell
$ npm start
```
