/**
* @name <%= Name %>
* @description This is the service entry point
*/
'use strict';

const http = require('http');
const cluster = require('cluster');
const os = require('os');

const version = require('./package.json').version;
const hydraExpress = require('@flywheelsports/hydra-express');
const jwtAuth = require('@flywheelsports/jwt-auth');

let config = require('@flywheelsports/config');

/**
* Load configuration file and initialize hydraExpress app.
*/
config.init('./config/config.json')
  .then(() => {
    config.version = version;

    jwtAuth.loadCerts(null, config.jwtPublicCert)
      .then((status) => {
        hydraExpress.init(config.getObject(), version, () => {
          <% if (express) {%>const app = hydraExpress.getExpressApp();<% } %>
          <% if (views) {%>
          app.set('views', './views');
          app.set('view engine', 'pug');
          <% } %>
          <% if (express) {%>
          hydraExpress.registerRoutes({
            '/v1/<%= name %>': require('./routes/<%= name %>-v1-routes')
          });
          <% } %>
        })
          .then((serviceInfo) => {
            console.log('serviceInfo', serviceInfo);
          })
          .catch((err) => {
            console.log('err', err);
          });
      });
  });
