/**
* @name <%= Name %>
* @summary <%= Name %> Hydra<%_if (express) {%> Express<% } %> service entry point
* @description <%= purpose %>
*/
'use strict';

const version = require('./package.json').version;
<%_ if (express) { _%>const hydraExpress = require('fwsp-hydra-express');
<%_ } else { _%>const hydra = require('fwsp-hydra');<%_ } _%>
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
        <%_ if (logging) {_%>
        // Initialize logging
        if (config.logger) {
          require('fwsp-logger').initHydraExpress(
            hydraExpress, config.hydra.serviceName, config.logger
          );
        }
        <%_ } _%>
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
          .then(serviceInfo => console.log('serviceInfo', serviceInfo))
          .catch(err => console.log('err', err));
      <%_ } else { _%>
      config.hydra.serviceVersion = version;
      /**
      * Initialize hydra
      */
      hydra.init(config.hydra)
        .then(() => hydra.registerService())
        .then(serviceInfo => {
          <%_ if (logging) {_%>
            if (config.logger) {
              const Logger = require('fwsp-logger').Logger;
              hydra.logger = new Logger(
                  { name: serviceName },
                  config.logger.elasticsearch
              );
            } else {
              console.log('Warning: no logger entry in config');
            }
          <%_ } _%>
          let logEntry = `Starting ${serviceInfo.serviceName}`;
          hydra.sendToHealthLog('info', logEntry);
          console.log(logEntry);
          hydra.on('log', (entry) => {
            this.logger.info(entry);
          });
        })
        .catch(err => {
          console.log('Error initializing hydra', err);
        });
      <%_ } _%>
      <%_ if (auth) {_%>});<%_ } _%>
  });
