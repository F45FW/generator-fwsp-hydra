/**
 * @name <%= name %>-v1-api
 * @description This module packages the <%= Name %> API.
 */
'use strict';

const hydraExpress = require('fwsp-hydra-express');
const hydra = hydraExpress.getHydra();
const express = hydraExpress.getExpress();
<%_ if (auth) { _%>const jwtAuth = require('fwsp-jwt-auth');<%_ } _%>
const ServerResponse = require('fwsp-server-response');

let serverResponse = new ServerResponse();
<%_ if (cors) { _%>serverResponse.enableCORS(true);<%_ } _%>

let api = express.Router();

api.get('/', (req, res) => {
  serverResponse.sendOk(res, {
    result: {}
  });
});

module.exports = api;
