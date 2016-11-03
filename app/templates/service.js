/**
* @name <%= Name %>
* @summary <%= Name %> Hydra<%_if (express) {%> Express<% } %> service entry point
* @description <%= purpose %>
*/
'use strict';

const version = require('./package.json').version;
<%_ if (express) { _%>const hydraExpress = require('@flywheelsports/fwsp-hydra-express');
<%_ } else { _%>const hydra = require('@flywheelsports/fwsp-hydra');<%_ } _%>
<%_ if (auth) { _%>const jwtAuth = require('fwsp-jwt-auth');<%_ } _%>

let config = require('fwsp-config');

/**
* Load configuration file<% if (express) {%> and initialize hydraExpress app<% } %>.
*/
config.init('./config/config.json')
  .then(() => {
    config.version = version;
    <%_ if (auth) {_%>
    jwtAuth.loadCerts(null, config.jwtPublicCert)
      .then((status) => {
    <%_ } _%>
        <%_ if (express) {_%>
        hydraExpress.init(config.getObject(), version, () => {
          <%_ if (views) {_%>
          const app = hydraExpress.getExpressApp();
          app.set('views', './views');
          app.set('view engine', 'pug');
          <%_ } _%>
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
      <%_ } else { _%>
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
      <%_ } _%>
      <%_ if (auth) {_%>});<%_ } _%>
  });
