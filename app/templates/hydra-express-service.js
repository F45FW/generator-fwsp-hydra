/**
* @name <%= Name %>
* @summary <%= Name %> Hydra<%_if (express) {%> Express<% } %> service entry point
* @description <%= purpose %>
*/
'use strict';

const version = require('./package.json').version;
const hydraExpress = require('hydra-express');

<%_ if (auth) { _%>const jwtAuth = require('fwsp-jwt-auth');<%_ } _%>

<%_ if (logging) {_%>
const HydraExpressLogger = require('fwsp-logger').HydraExpressLogger;
hydraExpress.use(new HydraExpressLogger());
<%_ } _%>

let config = require('fwsp-config');

/**
* Load configuration file and initialize hydraExpress app
*/
config.init('./config/config.json')
  .then(() => {
    config.version = version;
  <%_ if (auth) {_%>
    return jwtAuth.loadCerts(null, config.jwtPublicCert);
  })
  .then(status => {
  <%_ } _%>
    return hydraExpress.init(config.getObject(), version, () => {
      <%_ if (views) {_%>
      const app = hydraExpress.getExpressApp();
      app.set('views', './views');
      app.set('view engine', 'pug');
      <%_ } _%>
      hydraExpress.registerRoutes({
        '/v1/<%= name %>': require('./routes/<%= name %>-v1-routes')
      });
    });
  })
  .then(serviceInfo => console.log('serviceInfo', serviceInfo))
  .catch(err => console.log('err', err));
