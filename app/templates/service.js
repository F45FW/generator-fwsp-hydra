/**
* @name <%= Name %>
* @description This is the service entry point
*/
'use strict';

const version = require('./package.json').version;
<% if (express) {%>const hydraExpress = require('@flywheelsports/fwsp-hydra-express');
<% } else {%>const hydra = require('@flywheelsports/fwsp-hydra');<% } %>

<% if (auth) {%>const jwtAuth = require('fwsp-jwt-auth');<% } %>

let config = require('fwsp-config');

/**
* Load configuration file<% if (express) {%> and initialize hydraExpress app<% } %>.
*/
config.init('./config/config.json')
  .then(() => {
    config.version = version;
    <% if (auth) {%>
    jwtAuth.loadCerts(null, config.jwtPublicCert)
      .then((status) => {
    <% } %>
        <% if (express) {%>
        hydraExpress.init(config.getObject(), version, () => {
          const app = hydraExpress.getExpressApp();
          <% if (views) {%>
          app.set('views', './views');
          app.set('view engine', 'pug');
          <% } %>
          hydraExpress.registerRoutes({
            '/v1/<%= name %>': require('./routes/<%= name %>-v1-routes')
          });
        })
          .then((serviceInfo) => {
            console.log('serviceInfo', serviceInfo);
          })
          .catch((err) => {
            console.log('err', err);
          });
      <% } else { %>
      config.hydra.serviceVersion = version;
      /**
      * Initialize hydra
      */
      hydra.init(config.hydra)
        .then(() => hydra.registerService())
        .then(serviceInfo => {
          let logEntry = `Starting ${serviceInfo.serviceName}`;
          hydra.sendToHealthLog('info', logEntry);
          console.log(logEntry);
          hydra.on('log', (entry) => {
            console.log('>>>> ', entry);
          });
        })
        .catch(err => {
          console.log('Error initializing hydra', err);
        });
      <% } %>
      <% if (auth) {%>});<% } %>
  });
