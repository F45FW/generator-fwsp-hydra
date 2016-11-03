/**
 * @name <%= name %>-v1-api
 * @description This module packages the <%= Name %> API.
 */
'use strict';

const hydraExpress = require('@flywheelsports/fwsp-hydra-express');
const hydra = hydraExpress.getHydra();
const express = hydraExpress.getExpress();
const jwtAuth = require('fwsp-jwt-auth');
const ServerResponse = require('fwsp-server-response');

let serverResponse = new ServerResponse();
serverResponse.enableCORS(true);

let api = express.Router();

api.get('/', (req, res) => {
  serverResponse.sendOk(res, {
    result: {}
  });
});

module.exports = api;
