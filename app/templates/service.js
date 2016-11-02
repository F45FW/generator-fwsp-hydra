/**
* @name <%= Name %>
* @description This is the service entry point
*/
'use strict';

const version = require('./package.json').version;
<% if (express) {%>const hydraExpress = require('@flywheelsports/hydra-express');<% } %>
<% if (auth) {%>const jwtAuth = require('@flywheelsports/jwt-auth');<% } %>

let config = require('@flywheelsports/config');

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
      <% } %>
      <% if (auth) {%>});<% } %>
  });
