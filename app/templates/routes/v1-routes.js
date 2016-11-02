/**
 * @name <%= name %>-v1-api
 * @description This module packages the <%= Name %> API.
 */
'use strict';

const path = require('path');
const hydraExpress = require('@flywheelsports/hydra-express');
const hydra = hydraExpress.getHydra();
const express = hydraExpress.getExpress();
const jwtAuth = require('@flywheelsports/jwt-auth');
const ServerResponse = require('@flywheelsports/server-response');
const pRequest = require('@flywheelsports/prequest');

let config = require('@flywheelsports/config');
let serverResponse = new ServerResponse();
serverResponse.enableCORS(true);

let api = express.Router();

api.get('/', (req, res) => {
  res.json({});
});

module.exports = api;
