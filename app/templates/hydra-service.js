/**
* @name <%= Name %>
* @summary <%= Name %> Hydra service entry point
* @description <%= purpose %>
*/
'use strict';

const version = require('./package.json').version;
const hydra = require('fwsp-hydra');
<%_ if (auth) { _%>const jwtAuth = require('fwsp-jwt-auth');<%_ } _%>
let config = require('fwsp-config');

<%_ if (logging) {_%>
const HydraLogger = require('fwsp-logger').HydraLogger;
hydra.use(new HydraLogger());
<%_ } _%>

/**
* Load configuration file
*/
config.init('./config/config.json')
  .then(() => {
    config.version = version;
    <%_ if (auth) {_%>
    jwtAuth.loadCerts(null, config.jwtPublicCert)
      .then((status) => {
    <%_ } _%>
      config.hydra.serviceVersion = version;
      /**
      * Initialize hydra
      */
      hydra.init(config.hydra)
        .then(() => hydra.registerService())
        .then(serviceInfo => {
          let logEntry = `Starting ${config.hydra.serviceName} (v.${config.version})`;
          hydra.sendToHealthLog('info', logEntry);
        })
        .catch(err => {
          console.log('Error initializing hydra', err);
        });
    <%_ if (auth) {_%>});<%_ } _%>
  });
