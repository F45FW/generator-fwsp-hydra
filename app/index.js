const generators = require('yeoman-generator'),
      mkdirp = require('mkdirp');

const SCAFFOLD_FOLDERS = ['config', 'specs', 'specs/helpers', 'scripts'],
      COPY_FILES = ['.editorconfig', '.eslintrc', '.gitattributes', '.nvmrc', '.jscsrc',
                    'specs/test.js', 'specs/helpers/chai.js', 'scripts/docker.js'],
      USER_PROMPTS = [
        {
          type    : 'input',
          name    : 'name',
          message : 'Name of the service (`-service` will be appended automatically)'
        },
        {
          type    : 'input',
          name    : 'ip',
          message : 'Host the service runs on?',
          default : ''
        },
        {
          type    : 'input',
          name    : 'port',
          message : 'Port the service runs on?',
          default : 0
        },
        {
          type    : 'input',
          name    : 'purpose',
          message : 'What does this service do?'
        },
        {
          type    : 'confirm',
          name    : 'auth',
          message : 'Does this service need auth?',
          default : false
        },
        {
          type    : 'confirm',
          name    : 'express',
          message : 'Is this a hydra-express service?',
          default : true
        },
        {
          when    : response => response.express,
          type    : 'confirm',
          name    : 'views',
          message : 'Set up a view engine?',
          default : false
        },
        {
          type    : 'confirm',
          name    : 'logging',
          message : 'Set up logging?',
          default : false
        },
        {
          when    : response => response.express,
          type    : 'confirm',
          name    : 'cors',
          message : 'Enable CORS on serverResponses?',
          default : false
        },
        {
          type    : 'confirm',
          name    : 'npm',
          message : 'Run npm install?',
          default : false
        },
      ];

module.exports = generators.Base.extend({

  prompting: function () {
    return this.prompt(USER_PROMPTS).then(function (answers) {
      this.appname = answers.name;
      this.serviceFolder = answers.name + '-service';
      this.port = answers.port;
      this.purpose = answers.purpose;
      this.auth = answers.auth;
      this.express = answers.express;
      this.views = this.express ? answers.views : false;
      this.logging = answers.logging;
      this.cors = this.express ? answers.cors : false;
      this.npm = answers.npm;
     }.bind(this));
  },

  scaffoldFolders: function(){
    if (this.express) {
      SCAFFOLD_FOLDERS.push('routes');
      if (this.views) {
        SCAFFOLD_FOLDERS.push('views');
      }
    }
    SCAFFOLD_FOLDERS.forEach((folder) => {
      mkdirp.sync(this.serviceFolder + '/' + folder);
    });
  },

  copyFiles: function() {
    if (this.auth) {
      COPY_FILES.push('config/service.pub');
    }
    COPY_FILES.forEach((file) => {
        this.copy(file, this.serviceFolder + '/' + file);
    });
  },

  copyTemplates: function () {
    var params = {
      name: this.appname,
      Name: this.appname.charAt(0).toUpperCase() + this.appname.slice(1),
      ip: this.ip,
      port: this.port,
      purpose: this.purpose,
      auth: this.auth,
      express: this.express,
      views: this.views,
      logging: this.logging,
      cors: this.cors,
      npm: this.npm
    };
    var copy = (src, dest) => {
      if (!dest) {
        dest = src;
      }
      this.fs.copyTpl(
        this.templatePath(src),
        this.destinationPath(this.serviceFolder + '/' + dest),
        params
      );
    };
    copy('.gitignore');
    copy('package.json');
    copy('README.md');
    copy('service.js', this.appname + '-service.js');
    copy('config/sample-config.json');
    copy('config/sample-config.json', 'config/config.json');
    if (this.express) {
      copy('routes/v1-routes.js', 'routes/' + this.appname + '-v1-routes.js');
    }
  },

  _done: function() {
    console.log(`\nDone!\n'cd ${this.serviceFolder}' then ${this.npm ? '' : '\'npm install\' and '}'npm start'\n`)
  },

  done: function() {
    if (this.npm) {
      process.chdir(process.cwd() + '/' + this.serviceFolder);
      this.installDependencies({
        bower: false,
        npm: true,
        callback: () => this._done()
      });
    } else {
      this._writeFiles(() => this._done());
    }
  }

});
