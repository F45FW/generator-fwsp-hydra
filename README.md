# generator-hydra

Yeoman generator for Hydra services

## Synopsis
```
$ yo hydra
? Name of the service (`-service` will be appended automatically) new
? Port the service runs on? 4444
? What does this service do? Description for new-service
? Does this service need auth? Yes
? Is this a hydra-express service? Yes
? Set up a view engine? Yes
   create new-service/.eslintrc
   create new-service/.gitattributes
   create new-service/.gitignore
   create new-service/.nvmrc
   create new-service/.jscsrc
   create new-service/deploy-check.sh
   create new-service/specs/test.js
   create new-service/specs/helpers/chai.js
   create new-service/config/service.pub
   create new-service/package.json
   create new-service/README.md
   create new-service/new-service.js
   create new-service/config/sample-config.json
   create new-service/config/config.json
   create new-service/routes/new-v1-routes.js
```

## Notes

- If auth is selected, service.pub key will be added to config, fwsp-jwt-auth will be required in service.js, and it will load the public key.

- If express is selected, code initializing hydra-express will be added to service.js. Otherwise, code initializing a pure hydra service will be added.

- If view is selected, a view engine will be registered in service.js. This option will only be available if express is selected.

This generator is still very much a WIP - please report issues, or create a PR with fixes and improvements.
