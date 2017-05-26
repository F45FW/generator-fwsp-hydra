/**
* @name <%= Name %>
* @summary <%= Name %> Hydra<%_if (express) {%> Express<% } %> service entry point
* @description <%= purpose %>
*/
'use strict';

const hydraExpress = require('hydra-express');

<%_ if (logging) { _%>
const HydraExpressLogger = require('fwsp-logger').HydraExpressLogger;
<%_ } _%><%_ if (auth) { _%>
const JWTAuthPlugin = require('hydra-express-plugin-jwt-auth');
<%_ } _%><%_ if (logging || auth) { _%>
hydraExpress.use(
  <%_ if (logging) { _%>
  new HydraExpressLogger(),
  <%_ }
  if (auth) { _%>
  new JWTAuthPlugin()
  <%_ } _%>
);
<%_ } _%>

let config;
hydraExpress.init(`${__dirname}/config/config.json`, false, () => {
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
