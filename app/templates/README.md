# <%= name %>-service
Test program to authenticate with the flywheel auth service in prep for issuing other calls.

## Pre-installation

It's recommended that [NVM](https://github.com/creationix/nvm) be used to manage NodeJS versions.
The project includes an .nvmrc which specifies NodeJS 6.2.1

This project depends on FlywheelSports NPM modules. If you have a problem installing it's likely that you don't yet have access to the NPM repos.

## Installation

```javascript
$ nvm use
$ npm install
```

## Trial

```shell
$ cp config/sample-config.json config/config.json
$ npm start
```
