/**
* @name <%= Name %>
* @summary <%= Name %> Hydra service entry point
* @description <%= purpose %>
*/
'use strict';

const version = require('./package.json').version;
const hydra = require('hydra');

<%_ if (logging) {_%>
const hydraLogger = new (require('fwsp-logger').HydraLogger)();
let log;
hydra.use(hydraLogger);

<%_ } _%>
let config = {};
hydra.init(`${__dirname}/config/config.json`, false)
  .then(newConfig => {
    config = newConfig;
    <%_ if (logging) { _%>
    log = hydraLogger.getLogger();
    <%_ } _%>
    return hydra.registerService();
  })
  .then(serviceInfo => {
    let logEntry = `Starting ${config.hydra.serviceName} (v.${config.hydra.serviceVersion})`;
    hydra.sendToHealthLog('info', logEntry);
    log.info({
      msg: logEntry
    });
    console.log(logEntry);
  })
  .catch(err => {
    console.log('Error initializing hydra', err);
    log.error({ message: 'Error initializing hydra', err });
  });
