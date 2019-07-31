# generator-fwsp-hydra

Yeoman generator for Hydra services

Requires yeoman 1.x

## Synopsis
```
$ npm install -g yo@^1 generator-fwsp-hydra
$ yo fwsp-hydra
? Name of the service (`-service` will be appended automatically) example
? Your full name? Eric Adum
? Your email address? eric@flywheelsports.com
? Host the service runs on?
? Port the service runs on? 0
? What does this service do? This is an example service.
? Does this service need auth? Yes
? Is this a hydra-express service? Yes
? Set up a view engine? No
? Enable CORS on serverResponses? No
? Set up logging? No
? Run npm install? No
   create example-service/.editorconfig
   create example-service/.eslintrc
   create example-service/.gitattributes
   create example-service/.nvmrc
   create example-service/specs/test.js
   create example-service/specs/helpers/chai.js
   create example-service/config/service.pub
   create example-service/.gitignore
   create example-service/package.json
   create example-service/README.md
   create example-service/example-service.js
   create example-service/config/sample-config.json
   create example-service/config/config.json
   create example-service/routes/example-v1-routes.js

Done!
'cd example-service' then 'npm install' and 'npm start'

$
```

## Notes

- If auth is selected, service.pub key will be added to config, fwsp-jwt-auth will be required in service.js, and it will load the public key.

- If express is selected, code initializing hydra-express will be added to service.js. Otherwise, code initializing a pure hydra service will be added.

- If view is selected, a view engine will be registered in service.js. This option will only be available if express is selected.

- If logging is selected, you should `npm install --global pino-elasticsearch`

This generator is still very much a WIP - please report issues, or create a PR with fixes and improvements.
